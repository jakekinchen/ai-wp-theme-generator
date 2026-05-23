import { describe, expect, it } from "vitest";
import { generateThemePlanWithDesignPipeline } from "@/lib/ai/design-pipeline";
import { MockThemePlannerProvider } from "@/lib/ai/mock-provider";
import { normalizeThemeInput } from "@/lib/theme-plan/normalize-input";

describe("design pipeline", () => {
  it("scores multiple candidates and returns a selection report", async () => {
    const input = normalizeThemeInput({
      themeName: "Archive Daily",
      slug: "archive-daily",
      description: "A magazine archive with daily dispatches, dense hierarchy, metadata rails, and high contrast.",
      siteType: "magazine",
      stickyNavigation: true,
      includeQueryLoop: true,
    });

    const result = await generateThemePlanWithDesignPipeline(input, new MockThemePlannerProvider());

    expect(result.plan.design.intent.signatureMove.length).toBeGreaterThan(24);
    expect(result.selection.candidates.length).toBeGreaterThanOrEqual(2);
    expect(result.selection.selectedScore).toBeGreaterThanOrEqual(80);
    expect(result.selection.candidates[0].score).toBeGreaterThanOrEqual(result.selection.candidates.at(-1)!.score);
  });
});
