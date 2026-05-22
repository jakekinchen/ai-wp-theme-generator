import { describe, expect, it } from "vitest";
import { compileTheme } from "@/lib/compiler/compile-theme";
import { validateFileMap } from "@/lib/validation/validate-file-map";
import { photographyThemePlan } from "../fixtures/theme-plan.photography";

describe("validateFileMap", () => {
  it("passes a compiled fixture", () => {
    expect(validateFileMap(compileTheme(photographyThemePlan)).status).toBe("passed");
  });

  it("catches missing index templates, bad pattern refs, and unsafe paths", () => {
    const files = compileTheme(photographyThemePlan);
    expect(validateFileMap(files.filter((file) => !file.path.endsWith("templates/index.html"))).status).toBe("failed");
    expect(validateFileMap(files.map((file) => file.path.endsWith("templates/index.html") ? { ...file, content: file.content.replace("obsidian-lens/hero", "obsidian-lens/missing") } : file)).status).toBe("failed");
    expect(validateFileMap([...files, { path: "../evil.php", content: "" }]).status).toBe("failed");
  });
});
