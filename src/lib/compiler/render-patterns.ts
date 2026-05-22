import { ThemePlan } from "@/lib/theme-plan/types";
import {
  renderArchiveQueryPattern,
  renderCtaBandPattern,
  renderFeaturedQueryPattern,
  renderHeroPattern,
  renderPostHeaderPattern,
  renderSplitIntroPattern,
} from "./renderers/pattern";

export function renderPatterns(plan: ThemePlan): Record<string, string> {
  return {
    "patterns/hero.php": renderHeroPattern(plan),
    "patterns/split-intro.php": renderSplitIntroPattern(plan),
    "patterns/featured-query.php": renderFeaturedQueryPattern(plan),
    "patterns/archive-query.php": renderArchiveQueryPattern(plan),
    "patterns/post-header.php": renderPostHeaderPattern(plan),
    "patterns/cta-band.php": renderCtaBandPattern(plan),
  };
}
