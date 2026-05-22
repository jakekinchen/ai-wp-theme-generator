import { describe, expect, it } from "vitest";
import { compileTheme } from "@/lib/compiler/compile-theme";
import { validateFileMap } from "@/lib/validation/validate-file-map";
import { photographyThemePlan } from "../fixtures/theme-plan.photography";

describe("block renderers", () => {
  it("emits allowed core block markup with escaped text and query fallback", () => {
    const files = compileTheme({
      ...photographyThemePlan,
      homepage: photographyThemePlan.homepage.map((section) =>
        section.kind === "hero" ? { ...section, heading: "<Unsafe headline>" } : section,
      ),
    });
    const joined = files.map((file) => file.content).join("\n");
    expect(joined).toContain("wp:query-no-results");
    expect(joined).toContain("&lt;Unsafe headline&gt;");
    expect(joined).toContain("wp:site-title");
    expect(joined).toContain("wp:navigation");
    expect(validateFileMap(files).status).toBe("passed");
  });
});
