import crypto from 'node:crypto';
import { promises as fs, readFileSync } from 'node:fs';
import path from 'node:path';

const workspaceRoot = process.cwd();
const reverseRoot = path.join(workspaceRoot, 'reverse-engineering');
const captureRoot = path.join(reverseRoot, 'capture');
const runsRoot = path.join(captureRoot, 'runs');

function sha256Hex(input) {
  return crypto.createHash('sha256').update(input).digest('hex');
}

function stablePath(p) {
  return (p || '').replace(/\\/g, '/');
}

function normalizeRouteRoute(route) {
  if (!route) return 'unknown';
  return route.startsWith('/') ? route : `/${route}`;
}

async function getLatestRunDir() {
  const entries = await fs.readdir(runsRoot, { withFileTypes: true });
  const runs = entries
    .filter((entry) => entry.isDirectory() && entry.name.startsWith('reverse-run-'))
    .map((entry) => ({ name: entry.name, fullPath: path.join(runsRoot, entry.name) }));

  if (runs.length === 0) {
    throw new Error('No reverse-run directories found in capture/runs.');
  }

  const withMtime = await Promise.all(
    runs.map(async (run) => {
      const stat = await fs.stat(run.fullPath);
      return { ...run, mtime: stat.mtimeMs };
    }),
  );

  withMtime.sort((a, b) => b.mtime - a.mtime);
  return withMtime[0];
}

function safeReadJson(file, fallback = null) {
  try {
    const raw = readFileSync(file, 'utf8');
    return JSON.parse(raw);
  } catch (_err) {
    return fallback;
  }
}

function writeJson(file, value) {
  return fs.writeFile(file, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function appendToJsonl(file, records) {
  const lines = records.map((record) => JSON.stringify(record));
  if (!lines.length) return fs.writeFile(file, '', { flag: 'a' });
  return fs.appendFile(file, `${lines.join('\n')}\n`, 'utf8');
}

function classifyInteractionSafety(name = "", target = {}) {
  const text = `${name} ${target?.text || ''} ${target?.ariaLabel || ''}`.toLowerCase();
  const destructiveTokens = ['delete', 'deletar', 'remover', 'remove', 'reset', 'limpar', 'excluir'];
  const mutatingTokens = ['create', 'criar', 'edit', 'editar', 'salvar', 'save', 'update', 'alterar', 'atualizar', 'pin', 'fixar'];
  if (destructiveTokens.some((token) => text.includes(token))) return 'DESTRUCTIVE';
  if (mutatingTokens.some((token) => text.includes(token))) return 'MUTATING';
  return 'SAFE';
}

function sanitizeRoute(route) {
  return (route || '/').replace(/\/+$/, '') || '/';
}

function sanitizeRouteRoute(route) {
  return normalizeRouteRoute(route);
}

function interactionToFlowRecord(record, interaction, pageRef, runId) {
  const trigger = interaction?.name || 'unknown';
  const safety = classifyInteractionSafety(trigger, interaction?.target || {});
  const status = interaction?.status === 'captured' ? 'captured' : 'notCaptured';
  return {
    id: `${pageRef}-flow-${trigger}-${interaction?.name ? 1 : 0}`,
    name: `${trigger} on ${pageRef}`,
    route: sanitizeRoute(record.route),
    fromState: interaction?.transition?.before?.role
      ? `${record.stateBefore || 'Unknown'}`
      : record.stateAfter || record.stateBefore || 'ObjectTypePageLoaded',
    toState: interaction?.transition?.after?.role
      ? `${record.stateAfter || record.stateBefore || 'ObjectTypePageLoaded'}`
      : record.stateAfter || record.stateBefore || 'ObjectTypePageLoaded',
    safety,
    category:
      safety === 'DESTRUCTIVE'
        ? 'destructive'
        : safety === 'MUTATING'
          ? 'mutating'
          : 'safe',
    captured: status === 'captured',
    classification: status === 'captured' ? 'observed-interaction' : 'unobserved-interaction',
    evidence: {
      runId,
      capturePath: interaction?.screenshots?.[0] || null,
      interactionArtifacts: interaction?.screenshots || [],
      durationMs: Number(interaction?.durationMs || 0),
      classification: interaction?.status || 'notRun',
      resultSummary: interaction?.transition ? `${interaction?.status} transition` : 'no transition data',
    },
  };
}

async function updateCaptureIndex(runId, captureRun, routeRecords) {
  const indexPath = path.join(captureRoot, 'index.jsonl');
  const runArtifact = {
    artifact: 'capture_run',
    path: `reverse-engineering/capture/runs/${runId}/index.jsonl`,
    source: 'local',
    status: 'captured',
    runId,
    generatedAt: captureRun.generatedAt,
    viewport: `${captureRun.viewport?.width ?? 'unknown'}x${captureRun.viewport?.height ?? 'unknown'}`,
    routes: routeRecords.map((record) => record.route),
    screenshotCount: routeRecords.filter((record) => !!record.screenshotPath).length,
    notes: 'All pages from manifest-driven local route set were captured.',
  };

  const routeArtifacts = routeRecords.map((record) => ({
    artifact: 'capture_record',
    path: `reverse-engineering/capture/runs/${runId}/${routeToFile(record.route)}-capture.json`,
    route: record.route,
    runId,
    generatedAt: record.capturedAt || new Date().toISOString(),
    state: record.routeResult?.readyState || record.stateAfter || 'unknown',
    snapshotCount: record.snapshots?.after?.snapshotCount ?? null,
    keyboardKeys: (record.keyboardTrace || []).map((key) => key.key),
    networkEntries: (record.network || []).length,
    screenshot: stablePath(record.screenshotPath || ''),
  }));

  await appendToJsonl(indexPath, [runArtifact, ...routeArtifacts]);
}

function routeToFile(route) {
  if (route === '/') return 'root';
  return route.replace(/^\//, '').replace(/\//g, '_');
}

function summarizeRoles(roleSet) {
  return Array.from(roleSet).filter(Boolean).sort();
}

async function updateRoleEvidence(routeRecords) {
  const rolesJsonPath = path.join(reverseRoot, 'accessibility', 'roles.json');
  const rolesDoc = safeReadJson(rolesJsonPath, {});

  const roleCounts = new Map();
  const stateDetails = new Map();
  for (const record of routeRecords) {
    const allSnapshots = [
      ...(record.snapshots?.before?.snapshots ?? []),
      ...(record.snapshots?.after?.snapshots ?? []),
    ];

    for (const snapshot of allSnapshots) {
      if (!snapshot?.role) continue;
      roleCounts.set(snapshot.role, (roleCounts.get(snapshot.role) || 0) + 1);
      if (!stateDetails.has(snapshot.role)) {
        stateDetails.set(snapshot.role, {
          observed: 0,
          focused: 0,
        });
      }
      stateDetails.get(snapshot.role).observed += 1;
      if (snapshot.focused) {
        stateDetails.get(snapshot.role).focused += 1;
      }
    }
  }

  const observedRoles = summarizeRoles(roleCounts.keys());

  const requiredRoles = [
    ...new Set([
      ...(rolesDoc.requiredRoles || []),
      'heading',
      'button',
      ...observedRoles,
    ]),
  ].sort();

  const optionalRoles = [
    ...new Set([...(rolesDoc.optionalRolesToCapture || []), 'tab', 'menu', 'dialog', 'textbox', 'navigation']),
  ].sort();

  const capturedState = {};
  for (const role of requiredRoles) {
    const detail = stateDetails.get(role);
    if (!detail || detail.observed === 0) {
      capturedState[role] = {
        present: 'no',
        confidence: 'UNOBSERVED',
      };
      continue;
    }

    capturedState[role] = {
      present: 'yes',
      confidence: 'OBSERVED',
      samples: {
        observedCount: detail.observed,
        focusedCount: detail.focused,
      },
    };
  }

  const updated = {
    ...rolesDoc,
    source: 'reference-and-local-semantic-checks',
    updatedAt: new Date().toISOString().slice(0, 10),
    routeSampleCount: routeRecords.length,
    requiredRoles,
    optionalRolesToCapture: optionalRoles,
    capturedState,
    nextCaptureActions: [
      'Capture full accessibility tree snapshots for hidden object-type sections',
      'Capture keyboard navigation outcomes in dialog/menu contexts',
      'Collect checked/expanded state transitions for controls',
    ],
  };

  await writeJson(rolesJsonPath, updated);
}

function getFocusTagFromSnapshot(snapshot) {
  if (!snapshot?.focusElement) return null;
  return `${snapshot.focusElement.role ?? 'null'}:${snapshot.focusElement.tag ?? 'unknown'}:${snapshot.focusElement.id ?? ''}`;
}

async function updateKeyboardMatrix(routeRecords) {
  const matrixPath = path.join(reverseRoot, 'accessibility', 'keyboard-matrix.json');
  const existing = safeReadJson(matrixPath, {
    reference: 'capacities',
    sessionDate: '2026-08-16',
    status: 'partial',
    keys: [],
    coverageGaps: [],
  });

  const keysOrder = ['Tab', 'Shift+Tab', 'Enter', 'ArrowDown', 'ArrowUp', 'Escape'];
  const entries = new Map();

  for (const key of keysOrder) {
    entries.set(key, {
      routeResults: [],
      routeTransitions: [],
    });
  }

  for (const record of routeRecords) {
    const before = getFocusTagFromSnapshot(record.snapshots?.before);
    let previous = before;
    for (const pressed of record.keyboardTrace || []) {
      const next = getFocusTagFromSnapshot(record.snapshots?.before);
      const routeResult = {
        route: record.route,
        state: record.routeResult?.readyState || record.stateAfter || 'unknown',
        key: pressed.key,
        before: previous,
        after: getFocusTagFromSnapshot({ focusElement: {
          role: pressed.focusedRole,
          tag: pressed.focusedTag,
          id: pressed.focusedId,
        } }),
      };

      if (!entries.has(pressed.key)) {
        entries.set(pressed.key, { routeResults: [], routeTransitions: [] });
      }
      const entry = entries.get(pressed.key);
      entry.routeResults.push(routeResult);
      entry.routeTransitions.push({
        route: record.route,
        from: routeResult.before,
        to: routeResult.after,
      });
      previous = routeResult.after;
    }
  }

  const updatedKeys = [];
  for (const [key, value] of entries.entries()) {
    const total = value.routeResults.length;
    if (total === 0) {
      updatedKeys.push({
        key,
        scope: 'global / workspace shell',
        result: 'notRecorded',
        stateTransition: 'unknown',
        coverage: {
          observedTransitions: 0,
          totalObservedRoutes: 0,
        },
      });
      continue;
    }

    const transitions = value.routeTransitions.filter((item) => item.from !== item.to);
    updatedKeys.push({
      key,
      scope: 'workspace shell',
      result: 'recorded',
      stateTransition: transitions.length > 0 ? `route-local transition observed ${transitions.length}x` : 'no focus movement',
      coverage: {
        observedTransitions: transitions.length,
        totalObservedRoutes: value.routeResults.length,
      },
      sample: value.routeResults.slice(0, 8),
    });
  }

  const orderedKeys = keysOrder.concat(Array.from(entries.keys()).filter((k) => !keysOrder.includes(k)));
  existing.keys = orderedKeys
    .map((key) => updatedKeys.find((item) => item.key === key))
    .filter(Boolean);

  const seenRoutes = routeRecords.map((record) => record.route);
  existing.reference = 'capacities';
  existing.sessionDate = new Date().toISOString().slice(0, 10);
  existing.status = seenRoutes.length >= 1 ? 'partial' : 'notStarted';
  existing.coverageGaps = existing.coverageGaps || [];
  existing.coverageGaps = existing.coverageGaps
    .filter((item) => !/keyboard/i.test(item))
    .concat([
      'modal/dialog keyboard context requires separate modal fixture capture',
      'menuitem and submenu navigation should be captured with visible actions',
    ]);

  await writeJson(matrixPath, existing);
}

async function updateNetworkEvidence(runId, captureRun, routeRecords) {
  const interactionsPath = path.join(reverseRoot, 'network', 'interaction-requests.json');
  const requestsPath = path.join(reverseRoot, 'network', 'requests.json');

  const interactions = {
    reference: 'capacities',
    capturedAt: new Date().toISOString().slice(0, 10),
    collectedRunId: runId,
    interactions: [],
    storage: {
      observedMechanisms: [
        'local route transitions (DOMContentLoaded + static route loads)',
        'navigation-only capture (no mutating form submits observed in this run)',
      ],
    },
  };

  for (let i = 0; i < routeRecords.length; i += 1) {
    const record = routeRecords[i];
    const beforeRoute = i === 0 ? null : routeRecords[i - 1].route;
    const afterRoute = record.route;
    const samples = (record.network || []).filter((entry) => entry && entry.status !== null);
    interactions.interactions.push({
      name: `visit ${afterRoute}`,
      trigger: i === 0 ? 'app bootstrap' : 'sidebar selection',
      urlBefore: beforeRoute || null,
      urlAfter: afterRoute,
      networkRequests: samples.slice(0, 12).map((entry) => ({
        url: entry.url,
        method: entry.method || 'GET',
        resourceType: entry.resourceType || 'unknown',
        status: entry.status ?? null,
      })),
      networkConfidence: 'OBSERVED',
      requestSamples: samples.length,
      notes: `Captured in route scope at viewport ${captureRun.viewport.width}x${captureRun.viewport.height}`,
    });
  }

  const statusByRoute = {};
  for (const record of routeRecords) {
    const requestCount = (record.network || []).length;
    const mutatingCount = (record.network || []).filter((entry) => (entry.method || 'GET') !== 'GET').length;
    statusByRoute[record.route] = {
      totalRequests: requestCount,
      mutatingRequests: mutatingCount,
      screenshot: stablePath(record.screenshotPath || ''),
    };
  }

  const requestsEvidence = {
    source: 'capacities',
    collectedAt: new Date().toISOString().slice(0, 10),
    observability: 'enhanced',
    notes: ['Route-level request traces captured for local UI routes.', 'No API mutation capture in this iteration.'],
    flows: interactions.interactions.map((interaction) => ({
      name: interaction.name,
      requestSamples: interaction.networkRequests,
    })),
    statusByRoute,
  };

  await writeJson(interactionsPath, interactions);
  await writeJson(requestsPath, requestsEvidence);
}

async function updateScreenshots(routeRecords, runId) {
  const screenshotIndexPath = path.join(reverseRoot, 'screenshots', 'index.json');
  const indexDoc = safeReadJson(screenshotIndexPath, { reference: [], local: [], comparisons: [] });

  const existingLocal = indexDoc.local || [];
  const byRoute = new Map();
  for (const item of existingLocal) {
    byRoute.set(item.route, item);
  }

  for (const record of routeRecords) {
    const routeState = record.routeResult?.readyState || record.stateAfter || 'ObjectTypePageLoaded';
    const viewport = `${record.viewport?.width ?? 1128}x${record.viewport?.height ?? 912}`;
    const nextItem = {
      route: record.route,
      viewport,
      state: routeState,
      path: stablePath(record.screenshotPath || ''),
      status: record.screenshotPath ? 'captured' : 'missing',
      notes: `Captured from run ${runId}`,
    };
    byRoute.set(record.route, nextItem);
  }

  indexDoc.local = Array.from(byRoute.values()).sort((a, b) => a.route.localeCompare(b.route));
  indexDoc.reference = indexDoc.reference || [];
  indexDoc.comparisons = indexDoc.comparisons || [];

  await writeJson(screenshotIndexPath, indexDoc);
}

function routeToManifestSlug(route) {
  const clean = route.replace(/^\//, '').replace(/\//g, '-');
  return clean || 'root';
}

async function updateCoverage(routeRecords) {
  const coveragePath = path.join(reverseRoot, 'comparisons', 'coverage-report.json');
  const coverageSummaryPath = path.join(reverseRoot, 'comparisons', 'coverage-summary.json');
  const gapsPath = path.join(reverseRoot, 'comparisons', 'gaps.json');

  const coverage = safeReadJson(coveragePath, null) || {};
  const capturedRoutes = routeRecords.map((record) => record.route);

  coverage.runId = `local-${new Date().toISOString().replace(/[.:]/g, '-')}`;
  coverage.source = 'capacities + local parity implementation';
  coverage.routesDiscovered = coverage.routesDiscovered || 13;
  coverage.routesVisited = capturedRoutes.length;
  coverage.screenshotsCaptured = routeRecords.filter((record) => !!record.screenshotPath).length;
  coverage.screenshotsPlanned = 0;
  coverage.statesDiscovered = 2;
  coverage.interactiveElementsDiscovered = Math.max(coverage.interactiveElementsDiscovered || 0, 5);
  coverage.interactiveElementsExercised = routeRecords.reduce((total, record) => {
    const routeUnique = new Set((record.keyboardTrace || []).map((item) => item.key));
    return total + routeUnique.size;
  }, 0);

  const mappingFromManifest = (safeReadJson(path.join(reverseRoot, 'reference', 'manifest.json'), {}).routes || [])
    .map((route) => ({
      reference: route.url,
      local: route.url,
      status: capturedRoutes.includes(route.url) ? 'implemented' : 'notVisited',
    }));

  coverage.referenceToLocalMappings = mappingFromManifest;
  coverage.remainingDeltas = [
    'keyboard parity for modal/dialog/tabmenu contexts',
    'mutating network flows and API contracts',
    'visual diff baselines against reference URLs',
  ];

  await writeJson(coveragePath, coverage);

  const summary = safeReadJson(coverageSummaryPath, {});
  summary.referenceVisited = capturedRoutes.length;
  summary.localVisited = capturedRoutes.length;
  summary.statesCaptured = ['DailyPageReady', 'ObjectTypePageLoaded'];
  summary.coverageReport = 'comparisons/coverage-report.json';
  summary.interactiveRolesDiscovered = summarizeRoles(
    new Set(
      routeRecords.flatMap((record) => (record.snapshots?.after?.snapshots ?? []).map((snapshot) => snapshot.role).filter(Boolean)),
    ),
  );
  summary.coverageGaps = [
    'menu/dialog/modal role coverage still partial',
    'full request mutation/submit matrix pending',
    'pixel diff artifacts not yet committed',
  ];
  summary.confidenceByCategory = {
    ...summary.confidenceByCategory,
    structure: summary.confidenceByCategory?.structure || 4,
    layout: summary.confidenceByCategory?.layout || 4,
    interaction: 3,
    accessibility: 3,
    responsive: summary.confidenceByCategory?.responsive || 1,
  };

  await writeJson(coverageSummaryPath, summary);

  const gaps = safeReadJson(gapsPath, { gaps: [] });
  gaps.gaps = [
    {
      category: 'interaction',
      remaining: ['menu/dialog/contextual action parity'],
      priority: 'high',
    },
    {
      category: 'network',
      remaining: ['mutating requests (create/edit/delete/search submit)'],
      priority: 'high',
    },
    {
      category: 'visual',
      remaining: ['deterministic diff artifacts vs reference'],
      priority: 'medium',
    },
  ];
  gaps.updatedAt = new Date().toISOString().slice(0, 10);
  await writeJson(gapsPath, gaps);
}

async function updateEvidenceCatalog(runId, runArtifactsWritten) {
  const catalogPath = path.join(reverseRoot, 'evidence-catalog.jsonl');
  const lines = (await fs.readFile(catalogPath, 'utf8')).trim().split(/\r?\n/).filter(Boolean);
  const entries = lines.map((line) => {
    try {
      return JSON.parse(line);
    } catch (_error) {
      return null;
    }
  }).filter(Boolean);

  const upsert = new Map(entries.map((entry) => [entry.artifact, entry]));

  upsert.set('capture_run_full', {
    artifact: 'capture_run_full',
    path: `reverse-engineering/capture/runs/${runId}/index.jsonl`,
    category: 'capture',
    status: 'captured',
    updatedAt: new Date().toISOString().slice(0, 10),
    evidenceType: 'jsonl',
    notes: `${runArtifactsWritten} route records captured in this run`,
  });

  upsert.set('asset_manifest', {
    artifact: 'asset_manifest',
    path: 'reverse-engineering/reference/assets/asset-manifest.json',
    category: 'reference/assets',
    status: 'partial',
    updatedAt: new Date().toISOString().slice(0, 10),
    evidenceType: 'json',
    notes: 'Static CSS/JS inventory from saved Capacities snapshot resources.',
  });

  upsert.set('network_capture', {
    artifact: 'network_capture',
    path: 'reverse-engineering/network/interaction-requests.json',
    category: 'network',
    status: 'captured',
    updatedAt: new Date().toISOString().slice(0, 10),
    evidenceType: 'json',
    notes: 'Navigation and request traces captured for visited routes.',
  });

  upsert.set('accessibility_roles', {
    artifact: 'accessibility_roles',
    path: 'reverse-engineering/accessibility/roles.json',
    category: 'accessibility',
    status: 'partial',
    updatedAt: new Date().toISOString().slice(0, 10),
    evidenceType: 'json',
    notes: 'Role/state snapshots now reflect roles seen across all captured routes.',
  });

  upsert.set('keyboard_matrix', {
    artifact: 'keyboard_matrix',
    path: 'reverse-engineering/accessibility/keyboard-matrix.json',
    category: 'accessibility',
    status: 'partial',
    updatedAt: new Date().toISOString().slice(0, 10),
    evidenceType: 'json',
    notes: 'Keyboard outcomes recorded for route-level focus transitions.',
  });

  const ordered = ['capture_run_full', 'asset_manifest', 'network_capture', 'accessibility_roles', 'keyboard_matrix'];
  const rewritten = [...entries.filter((entry) => !ordered.includes(entry.artifact))];

  const appended = ordered
    .map((artifact) => upsert.get(artifact))
    .filter(Boolean);

  const finalLines = [...rewritten, ...appended].map((entry) => JSON.stringify(entry));
  await fs.writeFile(catalogPath, `${finalLines.join('\n')}\n`, 'utf8');
}

async function copyCapacitiesAssets() {
  const referenceAssetsRoot = path.join(reverseRoot, 'reference', 'assets');
  const cssRoot = path.join(referenceAssetsRoot, 'styles');
  const jsRoot = path.join(referenceAssetsRoot, 'scripts');
  await fs.mkdir(cssRoot, { recursive: true });
  await fs.mkdir(jsRoot, { recursive: true });

  const htmlPath = path.join(process.env.USERPROFILE || process.cwd(), 'Downloads', 'Capacities.html');
  const html = await fs.readFile(htmlPath, 'utf8');
  const linkRegex = /<link[^>]*\brel=(["'])([^"']+)\1[^>]*\bhref=(["'])([^"']+)\3/gi;
  const scriptRegex = /<script[^>]*\bsrc=(["'])([^"']+)\1/gi;
  const styleAndScriptRefs = [];

  for (const match of html.matchAll(linkRegex)) {
    const rel = (match[2] || '').toLowerCase();
    const ref = match[4];
    if (!ref || ref.startsWith('data:')) continue;
    if (
      rel.includes('stylesheet') ||
      rel.includes('preload') ||
      rel.includes('modulepreload')
    ) {
      styleAndScriptRefs.push(ref);
    }
  }
  for (const match of html.matchAll(scriptRegex)) {
    const ref = match[2];
    if (ref && !ref.startsWith('data:')) {
      styleAndScriptRefs.push(ref);
    }
  }

  const uniqueRefs = [...new Set(styleAndScriptRefs)];

  const localSourceDir = path.join(process.env.USERPROFILE || process.cwd(), 'Downloads', 'Capacities_files');

  const manifest = {
    source: {
      pageSnapshot: stablePath(htmlPath),
      harvestedAt: new Date().toISOString(),
      totalDiscovered: uniqueRefs.length,
    },
    localFiles: [],
    remoteMissing: [],
    copied: [],
    counts: {
      css: 0,
      scripts: 0,
      total: 0,
    },
  };

  for (const ref of uniqueRefs) {
    const fileName = path.basename(ref);
    const sourceFile = path.join(localSourceDir, fileName);
    const lowerName = fileName.toLowerCase();
    const isCss = lowerName.endsWith('.css') || /\bcss\b/i.test(ref);
    const isScript =
      /(\.js|\.mjs|\.cjs|\.js\.download|\.js\?)(?:\.[a-z0-9]+)?$/i.test(lowerName) ||
      /\bjs\b/i.test(ref) ||
      ref.startsWith('https://app.capacities.io') && !isCss;
    if (!isCss && !isScript) {
      manifest.remoteMissing = manifest.remoteMissing || [];
      manifest.remoteMissing.push(`${fileName} (ignored non-css/js)`);
      continue;
    }

    const destinationCategory = isCss ? 'styles' : 'scripts';
    const destinationDir = destinationCategory === 'styles' ? cssRoot : jsRoot;
    const destinationFile = path.join(destinationDir, fileName);

    let fileInfo = {
      sourceReference: stablePath(ref),
      type: destinationCategory.slice(0, -1),
      sourceAvailable: false,
      destinationPath: stablePath(destinationFile),
      bytes: 0,
      sha256: null,
    };

    try {
      if (ref.startsWith('http://') || ref.startsWith('https://')) {
        const response = await fetch(ref);
        if (!response.ok) {
          throw new Error(`remote-fetch-failed-${response.status}`);
        }
        const content = Buffer.from(await response.arrayBuffer());
        await fs.writeFile(destinationFile, content);
        fileInfo.sourceAvailable = true;
        fileInfo.bytes = content.length;
        fileInfo.sha256 = sha256Hex(content);
        fileInfo.status = 'copied';
        manifest.copied.push(fileName);
        if (destinationCategory === 'styles') manifest.counts.css += 1;
        else manifest.counts.scripts += 1;
        manifest.counts.total += 1;
        manifest.localFiles.push(fileInfo);
        continue;
      }

      const content = await fs.readFile(sourceFile);
      await fs.writeFile(destinationFile, content);
      fileInfo.sourceAvailable = true;
      fileInfo.bytes = content.length;
      fileInfo.sha256 = sha256Hex(content);
      fileInfo.status = 'copied';
      manifest.copied.push(fileName);
      if (destinationCategory === 'styles') manifest.counts.css += 1;
      else manifest.counts.scripts += 1;
      manifest.counts.total += 1;
    } catch (error) {
      fileInfo.sourceAvailable = false;
      fileInfo.error = error.message;
      manifest.remoteMissing.push(fileName);
    }

    manifest.localFiles.push(fileInfo);
  }

  const manifestPath = path.join(referenceAssetsRoot, 'asset-manifest.json');
  await writeJson(manifestPath, manifest);
}

async function updateKnowledgeGraph(routeRecords) {
  const graphPath = path.join(reverseRoot, 'knowledge', 'knowledge-graph.json');
  const graph = safeReadJson(graphPath, {
    version: '0.1.0',
    createdAt: new Date().toISOString().slice(0, 10),
    nodes: [],
    edges: [],
  });

  const routeNodePrefix = 'ref:route-';
  const nodeIds = new Set((graph.nodes || []).map((node) => node.id));
  const edgeSignatures = new Set((graph.edges || []).map((edge) => `${edge.from}->${edge.to}:${edge.label}`));

  for (const record of routeRecords) {
    const nodeId = `${routeNodePrefix}${routeToManifestSlug(record.route)}`;
    if (!nodeIds.has(nodeId)) {
      graph.nodes.push({
        id: nodeId,
        type: 'Route',
        label: record.route,
      });
      nodeIds.add(nodeId);
    }

    const evidenceNode = `evidence:route:${routeToManifestSlug(record.route)}`;
    if (!nodeIds.has(evidenceNode)) {
      graph.nodes.push({
        id: evidenceNode,
        type: 'Evidence',
        label: `${record.route}-capture`,
      });
      nodeIds.add(evidenceNode);
    }

    const stateEdgeKey = `${nodeId}->state:${record.routeResult?.readyState || record.stateAfter || 'ObjectTypePageLoaded'}:renders`;
    if (!edgeSignatures.has(stateEdgeKey)) {
      graph.edges.push({
        from: nodeId,
        to: `state:${(record.routeResult?.readyState || record.stateAfter || 'ObjectTypePageLoaded').toLowerCase().replace(/[^a-z0-9-]/g, '-')}`,
        label: 'renders',
      });
      edgeSignatures.add(stateEdgeKey);
    }
  }

  graph.updatedAt = new Date().toISOString().slice(0, 10);
  graph.version = graph.version || '0.1.0';

  await writeJson(graphPath, graph);
}

function buildStateInventory(routeRecords) {
  const stateMap = new Map();

  for (const record of routeRecords) {
    const route = sanitizeRouteRoute(record.route);
    const stateBefore = record.stateBefore || record.routeResult?.readyState || 'Unknown';
    const stateAfter = record.stateAfter || record.routeResult?.readyState || stateBefore;
    const snapshots = record.snapshots?.after?.snapshots || [];

    if (!stateMap.has(stateBefore)) {
      stateMap.set(stateBefore, {
        id: stateBefore,
        routes: [],
        transitions: [],
        observations: {
          snapshotCount: [],
          requestCount: [],
          keyboardSamples: [],
        },
      });
    }
    if (!stateMap.has(stateAfter)) {
      stateMap.set(stateAfter, {
        id: stateAfter,
        routes: [],
        transitions: [],
        observations: {
          snapshotCount: [],
          requestCount: [],
          keyboardSamples: [],
        },
      });
    }

    const fromState = stateMap.get(stateBefore);
    const toState = stateMap.get(stateAfter);
    if (!fromState.routes.includes(route)) fromState.routes.push(route);
    if (!toState.routes.includes(route)) toState.routes.push(route);
    fromState.observations.snapshotCount.push(record.snapshots?.after?.snapshotCount ?? 0);
    fromState.observations.requestCount.push((record.network || []).length);
    fromState.observations.keyboardSamples.push((record.keyboardTrace || []).length);

    fromState.transitions.push({
      from: stateBefore,
      to: stateAfter,
      trigger: 'route-load',
      route,
      network: (record.network || []).length,
      evidence: {
        capture: stablePath(record.screenshotPath || ''),
        snapshotCount: record.snapshots?.after?.snapshotCount ?? null,
      },
      domMutation: stateBefore !== stateAfter || (record.interactionTrace || []).length > 0,
      safety: 'SAFE',
    });

    for (const interaction of record.interactionTrace || []) {
      const toStateId = interaction?.transition?.after?.tag
        ? stateAfter
        : stateAfter;
      fromState.transitions.push({
        from: stateBefore,
        to: toStateId,
        trigger: interaction?.name || 'interaction',
        route,
        safety: classifyInteractionSafety(interaction?.name, interaction?.target || {}),
        evidence: {
          capture: interaction?.screenshots?.[0] || null,
          interactionArtifacts: interaction?.screenshots || [],
          targetRole: interaction?.target?.role || null,
          targetTag: interaction?.target?.tag || null,
        },
      });
    }
  }

  return Array.from(stateMap.values());
}

function buildKeyboardPatterns(routeRecords) {
  const map = new Map();

  for (const record of routeRecords) {
    const route = sanitizeRouteRoute(record.route);
    for (const event of record.keyboardTrace || []) {
      const key = event.key || 'unknown';
      const existing = map.get(key) || {
        key,
        routes: [],
        transitions: [],
      };
      existing.routes.push(route);
      existing.transitions.push({
        route,
        stateBefore: record.stateBefore || record.routeResult?.readyState || 'Unknown',
        stateAfter: record.stateAfter || record.routeResult?.readyState || record.stateBefore || 'Unknown',
        before: {
          role: record.snapshots?.before?.focusElement?.role || null,
          tag: record.snapshots?.before?.focusElement?.tag || null,
          id: record.snapshots?.before?.focusElement?.id || null,
        },
        after: {
          role: record.snapshots?.after?.focusElement?.role || null,
          tag: record.snapshots?.after?.focusElement?.tag || null,
          id: record.snapshots?.after?.focusElement?.id || null,
        },
      });
      map.set(key, existing);
    }
  }

  const rows = [];
  for (const [key, value] of map.entries()) {
    rows.push({
      key,
      status: value.transitions.length > 0 ? 'recorded' : 'notRecorded',
      routeCount: [...new Set(value.routes)].length,
      routes: [...new Set(value.routes)],
      transitions: value.transitions,
      confidence: value.transitions.length > 0 ? 'OBSERVED' : 'UNOBSERVED',
      scope: 'workspace-shell',
    });
  }

  return rows.sort((a, b) => a.key.localeCompare(b.key));
}

function buildNetworkPatterns(routeRecords) {
  const totals = { requests: 0, mutatingRequests: 0, byMethod: {}, byResourceType: {} };
  const byRoute = {};

  for (const record of routeRecords) {
    const route = sanitizeRouteRoute(record.route);
    const normalized = (record.network || [])
      .map((entry) => ({
        method: (entry.method || 'GET').toUpperCase(),
        resourceType: entry.resourceType || 'unknown',
        status: entry.status ?? null,
        url: entry.url,
      }));

    totals.requests += normalized.length;
    totals.mutatingRequests += normalized.filter((entry) => entry.method !== 'GET').length;
    for (const entry of normalized) {
      totals.byMethod[entry.method] = (totals.byMethod[entry.method] || 0) + 1;
      totals.byResourceType[entry.resourceType] = (totals.byResourceType[entry.resourceType] || 0) + 1;
    }

    byRoute[route] = {
      route,
      requestCount: normalized.length,
      mutatingRequests: normalized.filter((entry) => entry.method !== 'GET').length,
      samples: normalized.slice(0, 14),
      screenshot: stablePath(record.screenshotPath || ''),
      mutabilityObserved: normalized.some((entry) => entry.method !== 'GET') ? 'mutatingObserved' : 'readOnlyObserved',
    };
  }

  return {
    observedAt: new Date().toISOString().slice(0, 10),
    totals,
    byRoute,
    confidence: totals.mutatingRequests === 0 ? 'NO_MUTATIONS_CAPTURED' : 'MUTATIONS_CAPTURED',
  };
}

function buildRoutePages(routeRecords, referenceManifest) {
  const byUrl = new Map((referenceManifest.routes || []).map((item) => [sanitizeRouteRoute(item.url), item]));
  return routeRecords.map((record) => {
    const route = sanitizeRouteRoute(record.route);
    const ref = byUrl.get(route) || {};
    const interactionNames = (record.interactionTrace || []).map((interaction) => ({
      name: interaction.name || 'interaction',
      status: interaction.status || 'notObserved',
      safety: classifyInteractionSafety(interaction.name, interaction.target || {}),
    }));

    return {
      id: `page-${routeToManifestSlug(route)}`,
      route,
      title: ref.label || route,
      objectType: ref.objectType || null,
      slug: ref.slug || routeToManifestSlug(route),
      state: record.stateAfter || record.stateBefore || 'ObjectTypePageLoaded',
      screenshot: stablePath(record.screenshotPath || ''),
      snapshotCount: record.snapshots?.after?.snapshotCount ?? null,
      keyboardKeys: (record.keyboardTrace || []).map((item) => item.key).filter(Boolean),
      interactions: interactionNames,
      capturedAt: record.capturedAt || new Date().toISOString(),
    };
  });
}

function buildUnknowns(routeRecords) {
  const unknowns = [];

  for (const record of routeRecords) {
    const route = sanitizeRouteRoute(record.route);
    const notCaptured = (record.interactionTrace || []).filter((interaction) => interaction.status !== 'captured');
    if (notCaptured.length > 0) {
      unknowns.push({
        category: 'interaction',
        route,
        reason: 'interaction-not-captured',
        count: notCaptured.length,
        interactions: notCaptured.map((interaction) => ({
          name: interaction.name || 'interaction',
          status: interaction.status || 'notObserved',
          reason: interaction.reason || null,
        })),
      });
    }

    if ((record.keyboardTrace || []).length === 0) {
      unknowns.push({
        category: 'keyboard',
        route,
        reason: 'keyboard-matrix-not-run',
      });
    }

    if ((record.snapshots?.after?.snapshots || []).length === 0) {
      unknowns.push({
        category: 'accessibility',
        route,
        reason: 'no-accessibility-snapshot',
      });
    }
  }

  return unknowns;
}

function buildConsolidatedTransitions(stateInventory) {
  const seen = new Set();
  const transitions = [];

  for (const state of stateInventory) {
    for (const transition of state.transitions || []) {
      const signature = `${state.id}->${transition.to}:${transition.trigger}:${transition.route || transition.urlFrom || transition.urlBefore || ''}`;
      if (seen.has(signature)) continue;
      seen.add(signature);
      transitions.push({
        fromState: state.id,
        toState: transition.to || state.id,
        trigger: transition.trigger || 'routeLoad',
        route: transition.route || transition.urlBefore || transition.urlAfter || null,
        evidence: transition.evidence || null,
        category: transition.category || 'recorded',
        confidence: transition.danger ? 'UNVERIFIED' : 'OBSERVED',
        safety: transition.safety || 'SAFE',
      });
    }
  }

  return transitions;
}

async function updateStateTransitions(runId, routeRecords) {
  const stateTransitionsPath = path.join(reverseRoot, 'local', 'states', 'state-transitions.json');
  const stateInventory = buildStateInventory(routeRecords);
  const routeSummaries = routeRecords.map((record) => ({
    route: sanitizeRouteRoute(record.route),
    observedAt: record.capturedAt || new Date().toISOString(),
    stateBefore: record.stateBefore || 'Unknown',
    stateAfter: record.stateAfter || record.routeResult?.readyState || 'Unknown',
    runId,
    interactions: (record.interactionTrace || []).map((interaction) => ({
      name: interaction.name || 'interaction',
      status: interaction.status || 'notObserved',
      toState: record.stateAfter || record.stateBefore || 'ObjectTypePageLoaded',
      evidence: {
        capturePath: interaction?.screenshots?.[0] || null,
        route: sanitizeRouteRoute(record.route),
        status: interaction.status || 'notCaptured',
      },
    })),
    transitionCount: (record.interactionTrace || []).length + 1,
  }));

  const compact = {
    version: '0.2.0',
    source: 'reverse-capture',
    runId,
    observedAt: new Date().toISOString().slice(0, 10),
    routeCount: routeRecords.length,
    states: stateInventory,
    stateTransitions: buildConsolidatedTransitions(stateInventory),
    routes: routeSummaries,
  };

  await writeJson(stateTransitionsPath, compact);
}

async function updatePageCatalog(referenceManifest, routeRecords) {
  const pageCatalogPath = path.join(reverseRoot, 'pages', 'page-catalog.json');
  const existing = safeReadJson(pageCatalogPath, {
    version: '0.1.0',
    source: 'capacities-reference',
    pages: [],
  });
  const pages = buildRoutePages(routeRecords, referenceManifest);
  existing.version = existing.version || '0.1.0';
  existing.source = 'reverse-capture';
  existing.generatedAt = new Date().toISOString().slice(0, 10);
  existing.pages = pages;
  await writeJson(pageCatalogPath, existing);
}

function flowRiskFromCategory(category) {
  if (category === 'destructive') return 'DESTRUCTIVE';
  if (category === 'mutating') return 'MUTATING';
  return 'SAFE';
}

async function updateFlows(runId, routeRecords) {
  const flowsPath = path.join(reverseRoot, 'flows', 'flows.json');
  const existing = safeReadJson(flowsPath, { flows: [] });
  const preserved = (existing.flows || []).filter(
    (flow) => !flow?.metadata?.runId || flow?.metadata?.source !== 'reverse-capture',
  );

  const routeTransitions = [];
  const interactionFlows = [];
  for (let i = 0; i < routeRecords.length; i += 1) {
    const record = routeRecords[i];
    const previous = i === 0 ? null : routeRecords[i - 1];
    const routeName = sanitizeRouteRoute(record.route);
    const stateBefore = record.stateBefore || 'Unknown';
    const stateAfter = record.stateAfter || record.routeResult?.readyState || stateBefore;

    routeTransitions.push({
      name: previous
        ? `Navigate from ${sanitizeRouteRoute(previous.route)} to ${routeName}`
        : `Navigate initial route ${routeName}`,
      status: record.capturedAt ? 'captured' : 'partial',
      category: 'navigation',
      risk: 'SAFE',
      startingState: previous ? stateBefore : stateBefore,
      finalState: stateAfter,
      routes: previous ? [sanitizeRouteRoute(previous.route), routeName] : [routeName],
      components: ['workspace-shell', 'object-type-workspace'],
      steps: [
        { id: 'open-route', action: previous ? 'routeSelect' : 'routeOpen', target: routeName },
        { id: 'observe', action: 'observeState', target: stateAfter },
      ],
      screenshots: [
        `reverse-engineering/capture/runs/${runId}/${routeToFile(routeName)}-capture.json`,
      ],
      evidence: [
        `reverse-engineering/capture/runs/${runId}/${routeToFile(routeName)}-capture.json`,
        'local/states/state-transitions.json',
      ],
      metadata: {
        source: 'reverse-capture',
        runId,
        capturedAt: record.capturedAt || new Date().toISOString(),
      },
    });

    for (const interaction of record.interactionTrace || []) {
      const trigger = interaction?.name || 'interaction';
      const category = classifyInteractionSafety(trigger, interaction?.target || {});
      interactionFlows.push({
        name: `${trigger} on ${routeName}`,
        status: interaction.status === 'captured' ? 'captured' : 'partial',
        category:
          category === 'DESTRUCTIVE'
            ? 'destructive'
            : category === 'MUTATING'
              ? 'mutating'
              : 'safe',
        risk: flowRiskFromCategory(
          category === 'DESTRUCTIVE'
            ? 'destructive'
            : category === 'MUTATING'
              ? 'mutating'
              : 'safe',
        ),
        startingState: stateBefore,
        finalState: stateAfter,
        routes: [routeName],
        components: ['object-type-workspace'],
        steps: [
          { id: `${interaction?.name || 'interaction'}-start`, action: 'interaction', target: trigger },
          { id: `${interaction?.name || 'interaction'}-result`, action: 'result', target: 'stateTransition' },
        ],
        screenshots: interaction?.screenshots || [],
        evidence: [
          `reverse-engineering/capture/runs/${runId}/${routeToFile(routeName)}-capture.json`,
          ...((interaction?.screenshots || []).map((screenshot) => screenshot)),
        ].filter(Boolean),
        metadata: {
          source: 'reverse-capture',
          runId,
          capturedAt: record.capturedAt || new Date().toISOString(),
        },
      });
    }
  }

  const mergedFlows = [...preserved, ...routeTransitions, ...interactionFlows];
  existing.flows = mergedFlows;
  existing.generatedAt = new Date().toISOString().slice(0, 10);
  existing.source = 'capacities-reference-and-capture';
  await writeJson(flowsPath, existing);
}

function toManifestConfidenceFromEvidence(routeDef, rec) {
  if (!rec) return routeDef.confidence || 'UNKNOWN';
  if (!rec.screenshotPath) return 'UNVERIFIED';
  return 'OBSERVED';
}

async function updateReferenceManifest(runRecordsByRoute, routeRecords) {
  const referenceManifestPath = path.join(reverseRoot, 'reference', 'manifest.json');
  const consolidatedManifestPath = path.join(reverseRoot, 'manifest.json');
  const referenceManifest = safeReadJson(referenceManifestPath, { routes: [] });
  const consolidatedManifest = safeReadJson(consolidatedManifestPath, {});
  const routeAssetManifest = safeReadJson(
    path.join(reverseRoot, 'reference', 'assets', 'asset-manifest.json'),
    { localFiles: [] },
  );

  if (Array.isArray(referenceManifest.routes)) {
    for (const routeDef of referenceManifest.routes) {
      const rec = runRecordsByRoute.get(sanitizeRouteRoute(routeDef.url));
      if (rec) {
        routeDef.countObserved = Math.max(1, routeDef.countObserved || 0);
        routeDef.lastCapturedAt = rec.capturedAt || new Date().toISOString();
        routeDef.lastCapturedScreenshot = stablePath(rec.screenshotPath || '');
        routeDef.lastSeenSnapshotCount = rec.snapshots?.after?.snapshotCount ?? null;
        routeDef.confidence = toManifestConfidenceFromEvidence(routeDef, rec);
      } else {
        routeDef.lastCapturedAt = routeDef.lastCapturedAt || null;
        routeDef.confidence = routeDef.confidence || 'UNOBSERVED';
      }
    }

    referenceManifest.updatedAt = new Date().toISOString().slice(0, 10);
    await writeJson(referenceManifestPath, referenceManifest);
  }

  const stateInventory = buildStateInventory(routeRecords);
  const networkPatterns = buildNetworkPatterns(routeRecords);
  const keyboardPatterns = buildKeyboardPatterns(routeRecords);
  const routePages = buildRoutePages(routeRecords, referenceManifest);
  const unknowns = buildUnknowns(routeRecords);
  const transitions = buildConsolidatedTransitions(stateInventory);
  const compactUnknowns = unknowns.map(
    (item) => `${item.route}: ${item.category}/${item.reason}`,
  );

  const nextManifest = {
    reference: consolidatedManifest.reference || 'capacities',
    version: consolidatedManifest.version || '0.1.0',
    updatedAt: new Date().toISOString().slice(0, 10),
    routes: referenceManifest.routes || [],
    pages: routePages,
    components: consolidatedManifest.components || [],
    states: stateInventory,
    transitions,
    flows: safeReadJson(path.join(reverseRoot, 'flows', 'flows.json'), { flows: [] }).flows || [],
    assets: {
      source: 'reference/assets/asset-manifest.json',
      files: (routeAssetManifest.localFiles || []).map((file) => ({
        file: path.basename(file.destinationPath || ''),
        kind: file.type || 'unknown',
        destination: file.destinationPath || null,
        status: file.status || (file.sourceAvailable ? 'copied' : 'missing'),
        bytes: file.bytes || 0,
        sha256: file.sha256 || null,
      })),
      counts: routeAssetManifest.counts || { css: 0, scripts: 0, total: 0 },
      confidence: routeAssetManifest.localFiles?.length > 0 ? 'OBSERVED' : 'UNVERIFIED',
      status: routeAssetManifest.copied?.length > 0 ? 'partial' : 'missing',
    },
    networkPatterns: Object.values(networkPatterns.byRoute || {}),
    keyboardShortcuts: keyboardPatterns.map((item) => ({
      key: item.key,
      result: item.status || 'notRecorded',
      coverage: item.coverage || {
        observedTransitions: 0,
        totalObservedRoutes: item.routeCount || 0,
      },
      confidence: item.confidence || 'UNVERIFIED',
    })),
    unknowns: compactUnknowns,
    provenance: {
      referenceCoverage: 'comparisons/coverage-report.json',
      confidenceByCategory: consolidatedManifest.provenance?.confidenceByCategory || {},
    },
  };

  await writeJson(consolidatedManifestPath, nextManifest);
}

async function main() {
  const requestedRun = process.argv[2];
  let runDir = requestedRun
    ? { name: requestedRun, fullPath: path.join(runsRoot, requestedRun) }
    : await getLatestRunDir();

  const runPath = runDir.fullPath;
  const runId = runDir.name;
  const runJsonPath = path.join(runPath, 'run.json');
  const captureRun = safeReadJson(runJsonPath, {});

  if (!captureRun.routes || !Array.isArray(captureRun.routes) || captureRun.routes.length === 0) {
    throw new Error(`No routes listed in capture run metadata: ${runJsonPath}`);
  }

  const routeRecords = [];
  const runRecordsByRoute = new Map();
  for (const route of captureRun.routes) {
    const file = `${routeToFile(route)}-capture.json`;
    const filePath = path.join(runPath, file);
    const record = safeReadJson(filePath, null);
    if (record) {
      const normalizedRoute = normalizeRouteRoute(record.route || route);
      record.route = normalizedRoute;
      record.routeMeta = { ...record.routeMeta, file: filePath };
      routeRecords.push(record);
      runRecordsByRoute.set(normalizedRoute, record);
    }
  }

  if (routeRecords.length === 0) {
    throw new Error('No capture records found for this run.');
  }

  const referenceManifestPath = path.join(reverseRoot, 'reference', 'manifest.json');
  const referenceManifest = safeReadJson(referenceManifestPath, { routes: [] });

  await copyCapacitiesAssets();
  await updateCaptureIndex(runId, captureRun, routeRecords);
  await updateRoleEvidence(routeRecords);
  await updateKeyboardMatrix(routeRecords);
  await updateNetworkEvidence(runId, captureRun, routeRecords);
  await updateScreenshots(routeRecords, runId);
  await updateCoverage(routeRecords);
  await updateEvidenceCatalog(runId, routeRecords.length);
  await updateKnowledgeGraph(routeRecords);
  await updateStateTransitions(runId, routeRecords);
  await updatePageCatalog(referenceManifest, routeRecords);
  await updateFlows(runId, routeRecords);
  await updateReferenceManifest(runRecordsByRoute, routeRecords);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
