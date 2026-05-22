import { describe, expect, it } from "vitest";
import { compileTheme } from "@/lib/compiler/compile-theme";
import { photographyThemePlan } from "../fixtures/theme-plan.photography";

describe("compileTheme", () => {
  it("returns all required files below the validated slug root", () => {
    const files = compileTheme(photographyThemePlan);
    const paths = files.map((file) => file.path);
    expect(paths.every((path) => path.startsWith("obsidian-lens/"))).toBe(true);
    expect(paths).toContain("obsidian-lens/style.css");
    expect(paths).toContain("obsidian-lens/theme.json");
    expect(paths).toContain("obsidian-lens/templates/index.html");
    expect(paths).toContain("obsidian-lens/patterns/hero.php");
  });
});
