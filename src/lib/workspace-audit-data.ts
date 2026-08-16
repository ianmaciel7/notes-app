import {
  type CreatedObjectFixture,
  workspaceAuditFixture,
} from "@/lib/workspace-audit-fixture";

export type AuditState =
  | "booting"
  | "hydrating"
  | "indexing"
  | "querying"
  | "ready"
  | "error";

type AuditMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

export type WorkspaceAuditData = {
  activeDate: string;
  locale: string;
  timezone: string;
  activeView: string;
  weekdayLabel: string;
  formattedDate: string;
  weekNumber: number;
  taskCount: number;
  tasks: readonly never[];
  dailyNote: { available: boolean; title: string };
  selectedModel: string;
  chat: {
    type: string;
    title: string;
    messages: readonly AuditMessage[];
  };
  createdObjects: readonly CreatedObjectFixture[];
};

export type AuditLoadProgress = {
  state: AuditState;
  pendingRequests: number;
  completedConditions: readonly string[];
};

export type AuditLoadResult = {
  data: WorkspaceAuditData;
  dataSource: string;
  queryCount: number;
  readyAtMs: number;
  diagnostics: readonly string[];
  completedConditions: readonly string[];
};

const storageKey = "notes-app:capacities-audit:v1";

function cloneFixture(): WorkspaceAuditData {
  return JSON.parse(JSON.stringify(workspaceAuditFixture));
}

function isCompleteFixture(value: unknown): value is WorkspaceAuditData {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<WorkspaceAuditData>;
  return (
    candidate.activeDate === workspaceAuditFixture.activeDate &&
    candidate.locale === workspaceAuditFixture.locale &&
    candidate.timezone === workspaceAuditFixture.timezone &&
    candidate.dailyNote?.available === true &&
    candidate.taskCount === 0 &&
    candidate.createdObjects?.length === 12 &&
    candidate.chat?.messages?.length === 2
  );
}

const nextTurn = () => new Promise<void>((resolve) => queueMicrotask(resolve));

export async function loadWorkspaceAuditData(
  onProgress: (progress: AuditLoadProgress) => void,
): Promise<AuditLoadResult> {
  const startedAt = performance.now();
  const completed = new Set<string>();
  const diagnostics: string[] = [];
  let pendingRequests = 0;

  const report = (state: AuditState) =>
    onProgress({
      state,
      pendingRequests,
      completedConditions: [...completed],
    });

  report("booting");
  await nextTurn();
  completed.add("bootstrap");

  report("hydrating");
  let hydrated: WorkspaceAuditData;
  const persisted = window.localStorage.getItem(storageKey);
  if (persisted) {
    try {
      const parsed: unknown = JSON.parse(persisted);
      if (!isCompleteFixture(parsed)) throw new Error("incomplete fixture");
      hydrated = parsed;
      diagnostics.push(
        "Hydrated the complete audit fixture from localStorage.",
      );
    } catch {
      hydrated = cloneFixture();
      window.localStorage.setItem(storageKey, JSON.stringify(hydrated));
      diagnostics.push(
        "Replaced an invalid persisted fixture with the canonical seed.",
      );
    }
  } else {
    hydrated = cloneFixture();
    window.localStorage.setItem(storageKey, JSON.stringify(hydrated));
    diagnostics.push(
      "Persisted the canonical audit fixture before querying it.",
    );
  }
  await nextTurn();
  completed.add("hydration");

  report("indexing");
  const objectsByDate = new Map<string, readonly CreatedObjectFixture[]>([
    [hydrated.activeDate, hydrated.createdObjects],
  ]);
  await nextTurn();
  completed.add("index");

  report("querying");
  const query = async <T>(name: string, read: () => T): Promise<T> => {
    pendingRequests += 1;
    report("querying");
    await nextTurn();
    const result = read();
    completed.add(name);
    pendingRequests -= 1;
    report("querying");
    return result;
  };

  const [dailyNote, tasks, createdObjects, chat] = await Promise.all([
    query("daily-note-query", () => hydrated.dailyNote),
    query("tasks-query", () => hydrated.tasks),
    query(
      "created-today-query",
      () => objectsByDate.get(hydrated.activeDate) ?? [],
    ),
    query("chat-query", () => hydrated.chat),
  ]);

  if (!dailyNote.available) throw new Error("Daily note is unavailable.");
  if (tasks.length !== 0) throw new Error("Audit task query is not empty.");
  if (createdObjects.length !== 12) {
    throw new Error(
      `Expected 12 created objects, received ${createdObjects.length}.`,
    );
  }
  if (chat.messages.length !== 2)
    throw new Error("Chat fixture is incomplete.");

  completed.add("no-pending-requests");
  const data = { ...hydrated, dailyNote, tasks, createdObjects, chat };
  const result = {
    data,
    dataSource: `localStorage:${storageKey}`,
    queryCount: 4,
    readyAtMs: performance.now() - startedAt,
    diagnostics,
    completedConditions: [...completed],
  };
  return result;
}
