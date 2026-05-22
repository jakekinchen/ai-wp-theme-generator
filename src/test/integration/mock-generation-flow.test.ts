import { describe, expect, it } from "vitest";
import { MockThemePlannerProvider } from "@/lib/ai/mock-provider";
import { compileTheme } from "@/lib/compiler/compile-theme";
import { packageTheme } from "@/lib/packaging/package-theme";
import { normalizeThemeInput } from "@/lib/theme-plan/normalize-input";
import { validateFileMap } from "@/lib/validation/validate-file-map";
import { validateThemePlan } from "@/lib/validation/validate-theme-plan";

describe("mock generation flow", () => {
  it("normalizes, generates, validates, compiles, validates output, and zips", async () => {
    const input = normalizeThemeInput({
      themeName: "Obsidian Lens",
      slug: "obsidian-lens",
      description: "A dark photography blog with editorial cards and sticky navigation.",
    });
    const plan = await new MockThemePlannerProvider().generateThemePlan(input);
    expect(validateThemePlan(plan).status).toBe("passed");
    const files = compileTheme(plan);
    expect(validateFileMap(files).status).toBe("passed");
    await expect(packageTheme(files)).resolves.toBeInstanceOf(Buffer);
  });
});
