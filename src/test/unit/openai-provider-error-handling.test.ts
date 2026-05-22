import { describe, expect, it } from "vitest";
import { OpenAIThemePlannerProvider } from "@/lib/ai/openai-provider";
import { normalizeThemeInput } from "@/lib/theme-plan/normalize-input";
import { photographyThemePlan } from "../fixtures/theme-plan.photography";

const input = normalizeThemeInput({
  themeName: "Obsidian Lens",
  slug: "obsidian-lens",
  description: "A dark photography blog with editorial cards and sticky navigation.",
});

describe("OpenAIThemePlannerProvider", () => {
  it("parses valid structured output", async () => {
    const provider = new OpenAIThemePlannerProvider({
      responses: { create: async () => ({ output_text: JSON.stringify(photographyThemePlan) }) },
    } as never);
    await expect(provider.generateThemePlan(input)).resolves.toEqual(photographyThemePlan);
  });

  it("returns a clear rate-limit error", async () => {
    const provider = new OpenAIThemePlannerProvider({
      responses: { create: async () => { throw new Error("429 rate limit"); } },
    } as never);
    await expect(provider.generateThemePlan(input)).rejects.toThrow(/rate limit/i);
  });
});
