import JSZip from "jszip";
import { describe, expect, it } from "vitest";
import { compileTheme } from "@/lib/compiler/compile-theme";
import { createThemeZip } from "@/lib/packaging/create-theme-zip";
import { packageTheme } from "@/lib/packaging/package-theme";
import { photographyThemePlan } from "../fixtures/theme-plan.photography";

describe("theme zip packaging", () => {
  it("packages a validated theme under one root folder", async () => {
    const buffer = await packageTheme(compileTheme(photographyThemePlan));
    const zip = await JSZip.loadAsync(buffer);
    expect(zip.file("obsidian-lens/style.css")).toBeTruthy();
    expect(zip.file("obsidian-lens/theme.json")).toBeTruthy();
    expect(zip.file("obsidian-lens/templates/index.html")).toBeTruthy();
    expect(Object.keys(zip.files).every((path) => path.startsWith("obsidian-lens/"))).toBe(true);
  });

  it("rejects unsafe paths", async () => {
    await expect(createThemeZip([{ path: "../evil.php", content: "" }])).rejects.toThrow();
  });
});
