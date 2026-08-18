#!/usr/bin/env node
import { existsSync } from "node:fs";
import { execSync, spawnSync } from "node:child_process";
import { resolve } from "node:path";

function run(command, env = process.env) {
  execSync(command, {
    stdio: "inherit",
    shell: true,
    env,
  });
}

function hasGraphify() {
  const probe = spawnSync("graphify", ["--help"], { stdio: "ignore" });
  return probe.status === 0;
}

function installWithPip() {
  console.log("Trying Graphify installation via pip...");
  run("python -m pip install --user graphifyy");
}

function installWithUv() {
  const cacheDir = resolve(process.cwd(), ".uv-cache");
  const toolDir = resolve(process.cwd(), ".uv-tools");
  const env = {
    ...process.env,
    UV_CACHE_DIR: cacheDir,
    UV_TOOL_DIR: toolDir,
  };
  console.log(`Trying Graphify installation via uv with local cache at ${cacheDir}...`);
  run("uv tool install graphifyy", env);
}

function configureProjectAfterInstall() {
  run("graphify install --platform codex --project");
  run("graphify install --platform codex");
  console.log("Graphify project wiring complete.");
}

if (hasGraphify()) {
  console.log("Graphify CLI already available. Wiring project...");
  configureProjectAfterInstall();
} else {
  try {
    installWithUv();
  } catch (e1) {
    console.error("uv install failed:");
    console.error(e1.message ?? e1);

    try {
      installWithPip();
    } catch (e2) {
      console.error("pip install failed:");
      console.error(e2.message ?? e2);
      console.error("Could not install Graphify automatically in this environment.");
      console.error("If this is a local machine, run one of the following:");
      console.error("  python -m pip install graphifyy");
      console.error("  uv tool install graphifyy (set UV_CACHE_DIR and UV_TOOL_DIR if needed)");
      console.error(
        "  Also ensure internet access to pypi.org and that uv cache/tool directories are writable."
      );
      process.exit(1);
    }
  }

  configureProjectAfterInstall();
}

if (!existsSync(resolve(process.cwd(), "graphify-out"))) {
  try {
    run("mkdir graphify-out");
  } catch {
    // no-op if directory already exists on the selected shell/OS
  }
}
