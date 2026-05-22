import { describe, expect, it } from "vitest";
import { renderThemeJson } from "@/lib/compiler/theme-json";
import { photographyThemePlan } from "../fixtures/theme-plan.photography";

describe("renderThemeJson", () => {
  it("renders valid version 3 theme.json from design tokens", () => {
    const parsed = JSON.parse(renderThemeJson(photographyThemePlan));
    expect(parsed.version).toBe(3);
    expect(parsed.settings.layout.contentSize).toBe("760px");
    expect(JSON.stringify(parsed)).not.toMatch(/https?:\/\//);
    expect(JSON.stringify(parsed)).toContain("#0e0e0f");
  });
});
