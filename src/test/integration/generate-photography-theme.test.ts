import JSZip from "jszip";
import { describe, expect, it } from "vitest";
import { MockThemePlannerProvider } from "@/lib/ai/mock-provider";
import { compileTheme } from "@/lib/compiler/compile-theme";
import { packageTheme } from "@/lib/packaging/package-theme";
import { normalizeThemeInput } from "@/lib/theme-plan/normalize-input";
import { validateFileMap } from "@/lib/validation/validate-file-map";
import { validateThemePlan } from "@/lib/validation/validate-theme-plan";

describe("photography theme generation", () => {
  it("ends with an installable zip whose root and key files exist", async () => {
    const input = normalizeThemeInput({
      themeName: "Obsidian Lens",
      slug: "obsidian-lens",
      description: "A dark photography blog with editorial cards and sticky navigation.",
      siteType: "blog",
      stickyNavigation: true,
    });
    const plan = await new MockThemePlannerProvider().generateThemePlan(input);
    expect(plan.design.direction).toBe("editorial-noir");
    expect(plan.navigation.sticky).toBe(true);

    expect(validateThemePlan(plan).status).toBe("passed");

    const files = compileTheme(plan);
    expect(validateFileMap(files).status).toBe("passed");

    const zip = await JSZip.loadAsync(await packageTheme(files));
    const entries = Object.keys(zip.files);
    expect(entries.every((entry) => entry.startsWith("obsidian-lens/"))).toBe(true);
    expect(zip.file("obsidian-lens/templates/index.html")).toBeTruthy();
    expect(zip.file("obsidian-lens/patterns/featured-query.php")).toBeTruthy();

    const heroSource = await zip.file("obsidian-lens/patterns/hero.php")!.async("string");
    expect(heroSource).toContain("hero-centered");

    const header = await zip.file("obsidian-lens/parts/header.html")!.async("string");
    expect(header).toContain("is-sticky");
  });
});
