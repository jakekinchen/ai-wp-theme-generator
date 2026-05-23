import { describe, expect, it } from "vitest";
import { buildThemePlanPrompt } from "@/lib/ai/prompt";
import { normalizeThemeInput } from "@/lib/theme-plan/normalize-input";

describe("buildThemePlanPrompt", () => {
  it("constrains the model to ThemePlan JSON instead of files", () => {
    const prompt = buildThemePlanPrompt(normalizeThemeInput({
      themeName: "Obsidian Lens",
      slug: "obsidian-lens",
      description: "A dark photography blog with editorial cards and sticky navigation.",
    }));
    expect(prompt).toContain("Do not use Custom HTML block");
    expect(prompt).toContain("editorial-noir");
    expect(prompt).toContain("query-grid");
    expect(prompt).toContain("design.intent");
    expect(prompt).toContain("obsidian-lens");
    expect(prompt).not.toContain("generate a zip");
    expect(prompt).not.toContain("serialize WordPress block markup");
  });
});
