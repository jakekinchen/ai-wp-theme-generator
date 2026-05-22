import JSZip from "jszip";
import { describe, expect, it } from "vitest";
import { MockThemePlannerProvider } from "@/lib/ai/mock-provider";
import { compileTheme } from "@/lib/compiler/compile-theme";
import { packageTheme } from "@/lib/packaging/package-theme";
import { normalizeThemeInput } from "@/lib/theme-plan/normalize-input";
import { validateFileMap } from "@/lib/validation/validate-file-map";
import { validateThemePlan } from "@/lib/validation/validate-theme-plan";

describe("agency theme generation", () => {
  it("produces a minimalist-agency direction with classic navigation and bordered cards", async () => {
    const input = normalizeThemeInput({
      themeName: "Plain Signal",
      slug: "plain-signal",
      description: "A minimalist agency site for strategy work with clear archive cards.",
      siteType: "agency",
      stickyNavigation: false,
    });
    const plan = await new MockThemePlannerProvider().generateThemePlan(input);
    expect(plan.design.direction).toBe("minimalist-agency");
    expect(plan.navigation.sticky).toBe(false);
    expect(plan.homepage.find((section) => section.kind === "query-grid")).toMatchObject({ cardStyle: "bordered" });

    expect(validateThemePlan(plan).status).toBe("passed");

    const files = compileTheme(plan);
    expect(validateFileMap(files).status).toBe("passed");

    const zip = await JSZip.loadAsync(await packageTheme(files));
    const entries = Object.keys(zip.files);
    expect(entries.every((entry) => entry.startsWith("plain-signal/"))).toBe(true);

    const featured = await zip.file("plain-signal/patterns/featured-query.php")!.async("string");
    expect(featured).toContain("card-bordered");

    const header = await zip.file("plain-signal/parts/header.html")!.async("string");
    expect(header).not.toContain("is-sticky");
  });
});
