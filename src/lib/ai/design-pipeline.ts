import { recipeForDirection } from "@/lib/design/recipes";
import { CandidateRole, DesignPipelineResult, selectBestCandidate } from "@/lib/design/critic";
import { NormalizedThemeInput } from "@/lib/theme-plan/input-schema";
import { buildThemePlanForDirection, chooseDirection } from "@/lib/theme-plan/fixtures";
import { ThemePlan } from "@/lib/theme-plan/types";
import { ThemePlannerProvider } from "./types";

const expressiveFallback: Record<ThemePlan["design"]["direction"], ThemePlan["design"]["direction"]> = {
  "editorial-noir": "luxury-portfolio",
  "soft-studio": "warm-newsletter",
  "brutalist-index": "magazine-archive",
  "luxury-portfolio": "editorial-noir",
  "magazine-archive": "brutalist-index",
  "minimalist-agency": "soft-studio",
  "warm-newsletter": "soft-studio",
};

const safeFallback: Record<ThemePlan["design"]["direction"], ThemePlan["design"]["direction"]> = {
  "editorial-noir": "soft-studio",
  "soft-studio": "minimalist-agency",
  "brutalist-index": "minimalist-agency",
  "luxury-portfolio": "minimalist-agency",
  "magazine-archive": "editorial-noir",
  "minimalist-agency": "soft-studio",
  "warm-newsletter": "soft-studio",
};

function candidateKey(plan: ThemePlan): string {
  const recipe = recipeForDirection(plan.design.direction);
  return [plan.design.direction, recipe.heroVisual, recipe.cardStyle, plan.design.intent.contentDensity].join(":");
}

function localCandidates(input: NormalizedThemeInput): Array<{ id: string; role: CandidateRole; plan: ThemePlan }> {
  const briefDirection = chooseDirection(input);
  const directions = [
    { id: "brief-match", role: "brief-match" as const, direction: briefDirection },
    { id: "expressive-alt", role: "expressive-alt" as const, direction: expressiveFallback[briefDirection] },
    { id: "safe-baseline", role: "safe-baseline" as const, direction: safeFallback[briefDirection] },
  ];

  return directions.map((candidate) => ({
    id: candidate.id,
    role: candidate.role,
    plan: buildThemePlanForDirection(candidate.direction, input),
  }));
}

export async function generateThemePlanWithDesignPipeline(
  input: NormalizedThemeInput,
  provider: ThemePlannerProvider,
): Promise<DesignPipelineResult> {
  const seen = new Set<string>();
  const providerPlan = await provider.generateThemePlan(input);
  const candidates = [
    { id: "model-authored", role: "model-authored" as const, plan: providerPlan },
    ...localCandidates(input),
  ].filter((candidate) => {
    const key = candidateKey(candidate.plan);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return selectBestCandidate(candidates, input);
}
