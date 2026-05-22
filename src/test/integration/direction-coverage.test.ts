import { describe, expect, it } from "vitest";
import { MockThemePlannerProvider } from "@/lib/ai/mock-provider";
import { compileTheme } from "@/lib/compiler/compile-theme";
import { normalizeThemeInput } from "@/lib/theme-plan/normalize-input";
import { validateFileMap } from "@/lib/validation/validate-file-map";

const briefs = [
  { themeName: "Newsletter Warm", slug: "newsletter-warm", description: "A warm newsletter with kitchen-table recipes and editorial photography.", siteType: "newsletter" as const, expectedDirection: "warm-newsletter" },
  { themeName: "Brutal Index", slug: "brutal-index", description: "A brutalist index of stark archival posts with industrial flavor.", expectedDirection: "brutalist-index" },
  { themeName: "Atelier", slug: "atelier", description: "A luxury fashion atelier with sweeping selected works and quiet whitespace.", expectedDirection: "luxury-portfolio" },
];

describe("direction routing produces distinct, valid themes", () => {
  it.each(briefs)("$themeName routes to $expectedDirection", async ({ expectedDirection, ...input }) => {
    const provider = new MockThemePlannerProvider();
    const plan = await provider.generateThemePlan(normalizeThemeInput(input));
    expect(plan.design.direction).toBe(expectedDirection);
    const files = compileTheme(plan);
    expect(validateFileMap(files).status).toBe("passed");
    const heroFile = files.find((file) => file.path.endsWith("patterns/hero.php"))!;
    const heroVariantMatch = heroFile.content.match(/hero-(centered|split|cover|editorial)/);
    expect(heroVariantMatch).toBeTruthy();
  });
});
