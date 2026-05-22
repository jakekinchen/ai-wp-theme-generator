import { describe, expect, it } from "vitest";
import { validateThemePlan } from "@/lib/validation/validate-theme-plan";
import { photographyThemePlan } from "../fixtures/theme-plan.photography";

describe("design quality validation", () => {
  it("fails bad palette contrast and homepage without hero", () => {
    expect(validateThemePlan({
      ...photographyThemePlan,
      design: { ...photographyThemePlan.design, palette: { ...photographyThemePlan.design.palette, background: "#ffffff", foreground: "#fffffe" } },
    }).status).toBe("failed");
    expect(validateThemePlan({ ...photographyThemePlan, homepage: photographyThemePlan.homepage.filter((section) => section.kind !== "hero") }).status).toBe("failed");
  });
});
