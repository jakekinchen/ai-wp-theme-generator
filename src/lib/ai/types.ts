import { NormalizedThemeInput } from "@/lib/theme-plan/input-schema";
import { ThemePlan } from "@/lib/theme-plan/types";

export interface ThemePlannerProvider {
  generateThemePlan(input: NormalizedThemeInput): Promise<ThemePlan>;
}
