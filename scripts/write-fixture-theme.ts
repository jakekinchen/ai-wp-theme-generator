import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { compileTheme } from "../src/lib/compiler/compile-theme";
import { buildFixtureThemePlan } from "../src/lib/theme-plan/fixtures";
import { validateFileMap } from "../src/lib/validation/validate-file-map";

const root = path.join(process.cwd(), ".wp-env", "themes");

const fixtures = [
  buildFixtureThemePlan(),
  buildFixtureThemePlan({ themeName: "Plain Signal", slug: "plain-signal", description: "A minimalist agency site for strategy work with clear archive cards.", siteType: "agency" }),
  buildFixtureThemePlan({ themeName: "Archive Daily", slug: "archive-daily", description: "A magazine archive with dense image-led story cards.", siteType: "magazine" }),
];

async function writeFixture(plan: ReturnType<typeof buildFixtureThemePlan>) {
  const files = compileTheme(plan);
  const validation = validateFileMap(files);
  if (validation.status === "failed") {
    const failures = validation.checks.filter((check) => check.status === "failed").map((check) => `${check.id}${check.message ? ": " + check.message : ""}`);
    throw new Error(`Fixture ${plan.meta.slug} failed validation: ${failures.join("; ")}`);
  }
  await rm(path.join(root, plan.meta.slug), { recursive: true, force: true });
  for (const file of files) {
    const destination = path.join(root, file.path);
    await mkdir(path.dirname(destination), { recursive: true });
    await writeFile(destination, file.content);
  }
  console.log(`Wrote ${files.length} files to .wp-env/themes/${plan.meta.slug}`);
}

async function main() {
  for (const plan of fixtures) {
    await writeFixture(plan);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
