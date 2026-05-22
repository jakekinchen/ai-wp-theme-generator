import { describe, expect, it } from "vitest";
import { normalizeThemeInput } from "@/lib/theme-plan/normalize-input";

const goodInput = {
  description: "A dark mode blog theme for photographers with a centered hero and editorial cards.",
  themeName: "Obsidian Lens",
  slug: "obsidian-lens",
};

describe("normalizeThemeInput", () => {
  it("rejects bad slugs before AI", () => {
    expect(() => normalizeThemeInput({ ...goodInput, slug: "Bad Slug" })).toThrow();
  });

  it("rejects overlong descriptions before AI", () => {
    expect(() => normalizeThemeInput({ ...goodInput, description: "x".repeat(2001) })).toThrow();
  });

  it("rejects dangerous block and PHP injection strings", () => {
    expect(() => normalizeThemeInput({ ...goodInput, description: `${goodInput.description} <!-- wp:html -->` })).toThrow();
    expect(() => normalizeThemeInput({ ...goodInput, description: `${goodInput.description} <?php echo 1; ?>` })).not.toThrow();
    expect(normalizeThemeInput({ ...goodInput, description: `${goodInput.description} <?php echo 1; ?>` }).description).not.toContain("<?php");
  });
});
