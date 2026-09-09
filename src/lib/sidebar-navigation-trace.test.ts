import { afterEach, beforeEach, expect, it, vi } from "vitest";

import {
  readSidebarNavigationTrace,
  recordSidebarNavigationTrace,
  SIDEBAR_NAVIGATION_TRACE_DATASET_KEY,
} from "@/lib/sidebar-navigation-trace";

beforeEach(() => {
  vi.stubGlobal("document", { documentElement: { dataset: {} } });
  vi.stubGlobal("window", {
    dispatchEvent: vi.fn(),
    localStorage: {
      getItem: () => null,
    },
  });
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

it("records sidebar navigation trace entries in the document dataset", () => {
  vi.stubEnv("NODE_ENV", "development");

  recordSidebarNavigationTrace("sidebar-click", "object-type-event", {
    ctrlKey: false,
    eventType: "click",
    label: "Images",
  });
  recordSidebarNavigationTrace("sidebar-navigation", "navigate-main-tab", {
    intent: "current",
    tabCountBefore: 1,
  });

  const raw = document.documentElement.dataset[SIDEBAR_NAVIGATION_TRACE_DATASET_KEY];
  const trace = readSidebarNavigationTrace();

  expect(raw).toBeTruthy();
  expect(trace).toMatchObject([
    {
      details: {
        ctrlKey: false,
        eventType: "click",
        label: "Images",
      },
      label: "object-type-event",
      scope: "sidebar-click",
    },
    {
      details: {
        intent: "current",
        tabCountBefore: 1,
      },
      label: "navigate-main-tab",
      scope: "sidebar-navigation",
    },
  ]);
});

it("keeps only the newest sidebar navigation trace entries", () => {
  vi.stubEnv("NODE_ENV", "development");

  for (let index = 0; index < 205; index += 1) {
    recordSidebarNavigationTrace("sidebar-click", "event", { index });
  }

  const trace = readSidebarNavigationTrace();

  expect(trace).toHaveLength(200);
  expect(trace[0]?.details).toMatchObject({ index: 5 });
  expect(trace.at(-1)?.details).toMatchObject({ index: 204 });
});
