import { ThemePlanSchema } from "@/lib/theme-plan/schema";
import { ThemePlan } from "@/lib/theme-plan/types";
import { validateDesignQuality } from "./validate-design-quality";
import { fail, pass, report, ValidationReport } from "./validation-report";

export function validateThemePlan(input: unknown): ValidationReport {
  const parsed = ThemePlanSchema.safeParse(input);
  if (!parsed.success) {
    return report([
      fail("theme-plan-schema", "ThemePlan schema validation", parsed.error.issues.map((issue) => issue.message).join("; ")),
    ]);
  }

  return report([
    pass("theme-plan-schema", "ThemePlan schema validation"),
    ...validateDesignQuality(parsed.data as ThemePlan),
  ]);
}
