import JSZip from "jszip";
import { describe, expect, it } from "vitest";
import { MockThemePlannerProvider } from "@/lib/ai/mock-provider";
import { compileTheme } from "@/lib/compiler/compile-theme";
import { packageTheme } from "@/lib/packaging/package-theme";
import { buildFixtureThemePlan } from "@/lib/theme-plan/fixtures";
import { normalizeThemeInput } from "@/lib/theme-plan/normalize-input";
import { validateFileMap } from "@/lib/validation/validate-file-map";
import { validateThemePlan } from "@/lib/validation/validate-theme-plan";

const magazineInput = {
  themeName: "Archive Daily",
  slug: "archive-daily",
  description: "A magazine archive with dense story cards and daily dispatch metadata.",
  siteType: "magazine" as const,
};

describe("magazine theme generation", () => {
  it("produces a magazine-archive direction with magazine cards and four columns", async () => {
    const plan = await new MockThemePlannerProvider().generateThemePlan(normalizeThemeInput(magazineInput));
    expect(plan.design.direction).toBe("magazine-archive");
    const grid = plan.homepage.find((section) => section.kind === "query-grid");
    expect(grid).toMatchObject({ cardStyle: "magazine", columns: 4 });

    expect(validateThemePlan(plan).status).toBe("passed");
    const files = compileTheme(plan);
    expect(validateFileMap(files).status).toBe("passed");

    const zip = await JSZip.loadAsync(await packageTheme(files));
    const featured = await zip.file("archive-daily/patterns/featured-query.php")!.async("string");
    expect(featured).toContain("card-magazine");
    expect(featured).toContain("\"columnCount\":4");
  });

  it("rejects mutated outputs (custom HTML, missing index, broken pattern ref)", () => {
    const files = compileTheme(buildFixtureThemePlan(magazineInput));
    expect(validateFileMap(files).status).toBe("passed");
    expect(validateFileMap(files.map((file) => file.path.endsWith("templates/index.html") ? { ...file, content: `${file.content}\n<!-- wp:html /-->` } : file)).status).toBe("failed");
    expect(validateFileMap(files.filter((file) => !file.path.endsWith("templates/index.html"))).status).toBe("failed");
    expect(validateFileMap(files.map((file) => file.path.endsWith("templates/home.html") ? { ...file, content: file.content.replace("archive-daily/hero", "archive-daily/missing") } : file)).status).toBe("failed");
  });
});
