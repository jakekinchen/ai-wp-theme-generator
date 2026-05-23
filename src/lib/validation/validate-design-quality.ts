import { ThemePlan } from "@/lib/theme-plan/types";
import { recipeForDirection } from "@/lib/design/recipes";
import { contrastRatio } from "./contrast";
import { fail, pass, warn, ValidationCheck } from "./validation-report";

export function validateDesignQuality(plan: ThemePlan): ValidationCheck[] {
  const checks: ValidationCheck[] = [];
  const { background, foreground, primary, accent } = plan.design.palette;
  const recipe = recipeForDirection(plan.design.direction);
  const query = plan.homepage.find((section) => section.kind === "query-grid");
  const bodyContrast = contrastRatio(background, foreground);
  const primaryContrast = contrastRatio(background, primary);
  const headings = plan.homepage.map((section) => "heading" in section ? section.heading : "").filter(Boolean);
  const duplicateHeadings = headings.filter((heading, index) => headings.indexOf(heading) !== index);

  checks.push(
    bodyContrast >= 4.5
      ? pass("foreground-background-contrast", "Foreground/background contrast", `Ratio ${bodyContrast.toFixed(2)}`)
      : fail("foreground-background-contrast", "Foreground/background contrast", `Ratio ${bodyContrast.toFixed(2)} is below 4.5`),
  );
  checks.push(
    primaryContrast >= 3
      ? pass("primary-background-contrast", "Primary/background contrast", `Ratio ${primaryContrast.toFixed(2)}`)
      : warn("primary-background-contrast", "Primary/background contrast", `Ratio ${primaryContrast.toFixed(2)} is below 3`),
  );
  checks.push(
    contrastRatio(background, accent) >= 2.5
      ? pass("accent-background-contrast", "Accent/background contrast")
      : warn("accent-background-contrast", "Accent/background contrast", "Accent may need manual adjustment."),
  );
  checks.push(
    plan.homepage.some((section) => section.kind === "hero")
      ? pass("homepage-has-hero", "Homepage has a strong visual section")
      : fail("homepage-has-hero", "Homepage has a strong visual section"),
  );
  checks.push(
    plan.homepage.every((section) => !("heading" in section) || section.heading.length <= 140)
      ? pass("reasonable-heading-length", "Heading lengths are reasonable")
      : fail("reasonable-heading-length", "Heading lengths are reasonable"),
  );
  checks.push(
    plan.homepage.every((section) => section.kind !== "cta-band" || section.buttonLabel.trim().length > 0)
      ? pass("cta-label-present", "CTA labels are present")
      : fail("cta-label-present", "CTA labels are present"),
  );
  checks.push(
    duplicateHeadings.length === 0
      ? pass("no-duplicate-section-headings", "No duplicate section headings")
      : warn("no-duplicate-section-headings", "No duplicate section headings", duplicateHeadings.join(", ")),
  );
  checks.push(
    plan.design.intent.signatureMove.length >= 24
      ? pass("specific-signature-move", "Design intent has a specific signature move")
      : fail("specific-signature-move", "Design intent has a specific signature move"),
  );
  checks.push(
    new Set(plan.design.intent.personality).size === plan.design.intent.personality.length
      ? pass("distinct-personality-tags", "Personality tags are distinct")
      : warn("distinct-personality-tags", "Personality tags are distinct"),
  );
  checks.push(
    query?.cardStyle === recipe.cardStyle
      ? pass("recipe-card-style-match", "Card treatment matches design recipe")
      : warn("recipe-card-style-match", "Card treatment matches design recipe", `Expected ${recipe.cardStyle}`),
  );
  checks.push(
    plan.design.intent.contentDensity === "high" && query && query.columns < 3
      ? warn("density-layout-match", "Content density matches layout", "High-density themes should use at least three columns.")
      : pass("density-layout-match", "Content density matches layout"),
  );

  return checks;
}
