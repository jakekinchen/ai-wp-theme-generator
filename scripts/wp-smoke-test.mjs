import { execFileSync, spawnSync } from "node:child_process";

const themes = ["obsidian-lens", "plain-signal", "archive-daily"];

function dockerAvailable() {
  const probe = spawnSync("docker", ["info"], { stdio: "ignore" });
  return probe.status === 0;
}

function wpEnv(args) {
  return execFileSync("npx", ["wp-env", "run", "cli", ...args], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

if (!dockerAvailable()) {
  console.log("Skipping wp-env smoke: docker is not available on this machine.");
  console.log("Install Docker Desktop and re-run `npm run test:wp` to activate generated fixtures.");
  process.exit(0);
}

for (const theme of themes) {
  console.log(`Activating ${theme} via wp-env...`);
  wpEnv(["wp", "theme", "activate", theme]);
  const active = wpEnv(["wp", "theme", "list", "--status=active", "--field=name"]);
  if (!active.split(/\s+/).includes(theme)) {
    throw new Error(`Expected ${theme} to be active, got: ${active}`);
  }
  console.log(`  → active`);
}

console.log("wp-env activated all generated fixture themes.");
