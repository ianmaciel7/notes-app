import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "@playwright/test";

const checkpoints = [
  { name: "1536", width: 1536, height: 912 },
  { name: "1280", width: 1280, height: 800 },
  { name: "1024", width: 1024, height: 768 },
  { name: "768", width: 768, height: 720 },
  { name: "480", width: 480, height: 844 },
  { name: "390", width: 390, height: 844 },
];

const baseUrl =
  process.env.PARITY_BASE_URL ??
  process.argv[2] ??
  "http://localhost:3000/pt-BR";
const outputRoot = path.resolve(
  process.env.PARITY_OUTPUT_DIR ?? ".temp/workspace-parity",
);

await mkdir(outputRoot, { recursive: true });

const browser = await chromium.launch({ headless: true });
const results = [];

try {
  for (const checkpoint of checkpoints) {
    const page = await browser.newPage({ viewport: checkpoint });
    const consoleErrors = [];
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });

    await page.goto(baseUrl, { waitUntil: "networkidle" });

    const state = await page.evaluate(() => {
      const rect = (selector) => {
        const elements = Array.from(document.querySelectorAll(selector));
        const element =
          elements.find((candidate) => {
            const box = candidate.getBoundingClientRect();
            return box.width > 0 && box.height > 0;
          }) ?? elements[0];
        if (!(element instanceof HTMLElement)) return null;
        const box = element.getBoundingClientRect();
        return { x: box.x, y: box.y, width: box.width, height: box.height };
      };

      const surface = Array.from(
        document.querySelectorAll('[data-slot="app-shell-surface"]'),
      ).find((candidate) => candidate.getBoundingClientRect().width > 0);
      const surfaceStyle = surface ? getComputedStyle(surface) : null;

      return {
        viewport: { width: window.innerWidth, height: window.innerHeight },
        document: {
          clientWidth: document.documentElement.clientWidth,
          scrollWidth: document.documentElement.scrollWidth,
        },
        desktop: {
          shell: rect('[data-slot="app-shell"]'),
          sidebar: rect('[data-slot="app-shell-sidebar"]'),
          main: rect('[data-slot="app-shell-main"]'),
          sidePanel: rect('[data-slot="app-shell-side-panel"]'),
        },
        mobile: {
          shell: rect('[data-slot="app-shell-mobile"]'),
          navigationTrigger: rect(
            '[data-slot="app-shell-mobile"] [data-slot="sheet-trigger"]',
          ),
          sidePanelTrigger: rect(
            '[data-slot="app-shell-mobile"] [data-slot="sheet-trigger"]:nth-of-type(2)',
          ),
        },
        surface: {
          rect: rect('[data-slot="app-shell-surface"]'),
          borderRadius: surfaceStyle?.borderRadius ?? null,
          borderWidth: surfaceStyle?.borderWidth ?? null,
          backgroundColor: surfaceStyle?.backgroundColor ?? null,
        },
      };
    });

    const screenshot = path.join(outputRoot, `${checkpoint.name}.png`);
    await page.screenshot({ path: screenshot, fullPage: false });
    results.push({
      checkpoint,
      url: page.url(),
      consoleErrors,
      state,
      screenshot,
    });
    await page.close();
  }
} finally {
  await browser.close();
}

const reportPath = path.join(outputRoot, "report.json");
await writeFile(
  reportPath,
  `${JSON.stringify({ baseUrl, generatedAt: new Date().toISOString(), results }, null, 2)}\n`,
);
process.stdout.write(`${reportPath}\n`);
