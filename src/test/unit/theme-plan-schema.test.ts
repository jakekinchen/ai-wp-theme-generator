import { describe, expect, it } from "vitest";
import { ThemePlanSchema } from "@/lib/theme-plan/schema";
import { photographyThemePlan } from "../fixtures/theme-plan.photography";

describe("ThemePlanSchema", () => {
  it("validates the photography fixture", () => {
    expect(ThemePlanSchema.safeParse(photographyThemePlan).success).toBe(true);
  });

  it("rejects an invalid slug", () => {
    expect(ThemePlanSchema.safeParse({ ...photographyThemePlan, meta: { ...photographyThemePlan.meta, slug: "Bad Slug" } }).success).toBe(false);
  });

  it("rejects missing homepage sections", () => {
    expect(ThemePlanSchema.safeParse({ ...photographyThemePlan, homepage: [] }).success).toBe(false);
  });

  it("rejects unsupported design directions", () => {
    expect(ThemePlanSchema.safeParse({ ...photographyThemePlan, design: { ...photographyThemePlan.design, direction: "space-cowboy" } }).success).toBe(false);
  });
});
