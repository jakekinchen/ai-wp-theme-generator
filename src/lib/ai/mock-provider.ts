import { buildFixtureThemePlan } from "@/lib/theme-plan/fixtures";
import { NormalizedThemeInput } from "@/lib/theme-plan/input-schema";
import { ThemePlan } from "@/lib/theme-plan/types";
import { ThemePlannerProvider } from "./types";

export class MockThemePlannerProvider implements ThemePlannerProvider {
  async generateThemePlan(input: NormalizedThemeInput): Promise<ThemePlan> {
    return buildFixtureThemePlan(input);
  }
}
