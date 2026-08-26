from pathlib import Path
import re
import textwrap


def replace(path: str, old: str, new: str, count: int = 1) -> None:
    file = Path(path)
    text = file.read_text(encoding="utf-8")
    if text.count(old) < count:
        raise SystemExit(f"Missing expected source in {path}: {old[:120]!r}")
    file.write_text(text.replace(old, new, count), encoding="utf-8")


workflow = Path(".github/workflows/one-shot-rules-compliance-v2.yml").read_text(
    encoding="utf-8"
)
match = re.search(
    r"      - name: Apply audited compliance patch\n        shell: python\n        run: \|\n(.*?)\n      - name: Setup pnpm",
    workflow,
    re.S,
)
if not match:
    raise SystemExit("Could not locate audited v2 compliance patch")
exec(compile(textwrap.dedent(match.group(1)), "<rules-compliance-v2>", "exec"))

workspace_tasks = Path(
    "openspec/changes/align-workspace-with-current-capacities/tasks.md"
)
text = workspace_tasks.read_text(encoding="utf-8")
old = '- [ ] 4.3 Remove production `demo`/`fixture` APIs touched by this change, move touched user-visible copy to `next-intl`, update every locale catalog, and keep object icons sourced from the central registry.'
new = '- [x] 4.3 Remove production `demo`/`fixture` APIs touched by this change, move touched user-visible copy to `next-intl`, update every locale catalog, and keep object icons sourced from the central registry.'
if old not in text:
    raise SystemExit("Workspace OpenSpec task 4.3 was not found")
workspace_tasks.write_text(text.replace(old, new, 1), encoding="utf-8")

replace(
    "tests/block-editor-contract.test.mjs",
    "assert.match(handleReferenceMetadata, /Drag.*move block/is);",
    "assert.match(handleReferenceMetadata, /Drag.*move the block around/is);",
)
replace(
    "tests/block-editor-contract.test.mjs",
    '''test("advanced Capacities blocks remain an explicit follow-up", () => {
  assert.match(tasksSource, /small text/);
  assert.match(tasksSource, /Mermaid\\/math/);
  assert.match(tasksSource, /multi-column\\/group/);
  assert.match(tasksSource, /media\\/object embeds/);
});''',
    '''test("advanced Capacities blocks remain an explicit follow-up", () => {
  assert.match(tasksSource, /small text/i);
  assert.match(tasksSource, /lateral\\/column\\/group drop semantics/i);
  assert.match(tasksSource, /explicit follow-ups/i);
  assert.match(tasksSource, /neutral schema/i);
});''',
)
replace(
    "tests/ci-baseline.test.mjs",
    'test("the localized workspace boots into the workspace fixture", async () => {',
    'test("the localized workspace boots into the production workspace composition", async () => {',
)
replace(
    "tests/ci-baseline.test.mjs",
    "  assert.match(route, /AtomicNotesWorkspace/);",
    "  assert.match(route, /WorkspaceViewsSurface/);\n  assert.doesNotMatch(route, /AtomicNotesWorkspace/);",
)
replace(
    "tests/ci-baseline.test.mjs",
    '  assert.match(header, /const initialSideTabs[\\s\\S]*?id: "explore"/);',
    '''  assert.match(
    header,
    /const \\[sideTabs, setSideTabs\\] = React\\.useState<AppHeaderTab\\[\\]>\\(\\(\\) => \\[[\\s\\S]*?id: "explore"[\\s\\S]*?label: t\\("primaryNavigation\\.explore"\\)/,
  );
  assert.doesNotMatch(header, /const initialSideTabs/);''',
)

perf = Path("tests/input-performance-contract.test.mjs")
perf_text = perf.read_text(encoding="utf-8")
old_perf = """  assert.match(blockEditor, /useBufferedTextCommit<BlockEditorDocument>/);
  assert.match(blockEditor, /onUpdate:[\\s\\S]*setDraft\\(/);"""
new_perf = """  assert.match(blockEditor, /useBufferedDocumentCommit/);
  assert.match(blockEditor, /onUpdate:[\\s\\S]*scheduleCommit\\(/);
  assert.match(blockEditor, /onBlur=\\{editable \\? flushCommit : undefined\\}/);
  assert.match(blockEditor, /onCompositionStart=\\{editable \\? startComposition : undefined\\}/);
  assert.match(blockEditor, /onCompositionEnd=\\{editable \\? finishComposition : undefined\\}/);"""
if old_perf not in perf_text:
    raise SystemExit("Input performance stale assertions were not found")
perf.write_text(perf_text.replace(old_perf, new_perf, 1), encoding="utf-8")

slash = Path("tests/slash-command-lifecycle.test.mjs")
slash_text = slash.read_text(encoding="utf-8")
old_slash = """  assert.match(
    source,
    /unmountFloatingElement = props\\.mount\\(menu\\.element\\)/,
  );"""
new_slash = """  assert.match(
    source,
    /unmountFloatingElement = props\\.mount\\(menu\\.element, \\{/,
  );
  assert.match(source, /onPosition: \\(position\\) =>/);"""
if old_slash not in slash_text:
    raise SystemExit("Slash mount stale assertion was not found")
slash.write_text(slash_text.replace(old_slash, new_slash, 1), encoding="utf-8")

for name in [
    ".github/workflows/one-shot-rules-compliance.yml",
    ".github/workflows/one-shot-rules-compliance-v2.yml",
    ".github/workflows/one-shot-rules-compliance-v3.yml",
    ".github/workflows/one-shot-rules-compliance-v4.yml",
    ".github/workflows/one-shot-rules-compliance-v5.yml",
    ".github/workflows/one-shot-rules-compliance-v6.yml",
    ".github/workflows/one-shot-rules-compliance-v7.yml",
    ".github/workflows/one-shot-rules-compliance-v8.yml",
    "scripts/apply-rules-compliance.py",
]:
    Path(name).unlink(missing_ok=True)
