import { NormalizedThemeInput } from "@/lib/theme-plan/input-schema";
import { chooseDirection } from "@/lib/theme-plan/fixtures";
import { ThemePlan } from "@/lib/theme-plan/types";
import { contrastRatio } from "@/lib/validation/contrast";
import { recipeForDirection } from "./recipes";

export type CandidateRole = "model-authored" | "brief-match" | "expressive-alt" | "safe-baseline";

export type DesignCandidateEvaluation = {
  id: string;
  role: CandidateRole;
  plan: ThemePlan;
  score: number;
  strengths: string[];
  risks: string[];
  verdict: string;
};

export type DesignCandidateSummary = Omit<DesignCandidateEvaluation, "plan"> & {
  direction: ThemePlan["design"]["direction"];
};

export type DesignSelectionReport = {
  selectedId: string;
  selectedScore: number;
  criticSummary: string;
  candidates: DesignCandidateSummary[];
};

export type DesignPipelineResult = {
  plan: ThemePlan;
  selection: DesignSelectionReport;
};

const genericHeadings = new Set(["latest stories", "keep exploring", "recent dispatches", "latest posts"]);

function uniqueCount(values: string[]): number {
  return new Set(values).size;
}

function densityMatchesSite(plan: ThemePlan, input: NormalizedThemeInput): boolean {
  if (input.siteType === "magazine") return plan.design.intent.contentDensity === "high";
  if (input.siteType === "newsletter" || input.siteType === "portfolio") {
    return plan.design.intent.contentDensity !== "high";
  }
  return true;
}

function hasPromptFit(plan: ThemePlan, input: NormalizedThemeInput): boolean {
  const text = `${input.description} ${input.preferredPalette ?? ""} ${input.typographyPreference ?? ""}`.toLowerCase();
  if (/dark|noir|cinema|photo/.test(text)) return plan.design.direction === "editorial-noir";
  if (/brutal|stark|industrial/.test(text)) return plan.design.direction === "brutalist-index";
  if (/luxur|atelier|premium|gallery/.test(text)) return plan.design.direction === "luxury-portfolio";
  if (/magazine|edition|front page|daily/.test(text)) return plan.design.direction === "magazine-archive";
  if (/newsletter|recipe|kitchen|dispatch/.test(text)) return plan.design.direction === "warm-newsletter";
  if (/agency|product|strategy|client/.test(text)) return plan.design.direction === "minimalist-agency";
  return true;
}

export function evaluateDesignCandidate(
  id: string,
  role: CandidateRole,
  plan: ThemePlan,
  input: NormalizedThemeInput,
): DesignCandidateEvaluation {
  const strengths: string[] = [];
  const risks: string[] = [];
  let score = 52;
  const expected = chooseDirection(input);
  const recipe = recipeForDirection(plan.design.direction);
  const hero = plan.homepage.find((section) => section.kind === "hero");
  const query = plan.homepage.find((section) => section.kind === "query-grid");
  const cta = plan.homepage.find((section) => section.kind === "cta-band");
  const bodyContrast = contrastRatio(plan.design.palette.background, plan.design.palette.foreground);
  const headings = plan.homepage.flatMap((section) => ("heading" in section ? [section.heading] : []));
  const genericCount = headings.filter((heading) => genericHeadings.has(heading.toLowerCase())).length;

  if (plan.design.direction === expected) {
    score += 12;
    strengths.push("matches the inferred design direction");
  } else {
    score -= 5;
    risks.push(`uses ${plan.design.direction} instead of inferred ${expected}`);
  }

  if (hasPromptFit(plan, input)) {
    score += 8;
    strengths.push("responds to explicit words in the brief");
  } else {
    score -= 8;
    risks.push("misses a strong design cue from the brief");
  }

  if (hero?.visualStyle === recipe.heroVisual) {
    score += 7;
    strengths.push("hero composition fits the selected recipe");
  }
  if (query?.cardStyle === recipe.cardStyle) {
    score += 7;
    strengths.push("query cards fit the selected recipe");
  }
  if (densityMatchesSite(plan, input)) {
    score += 6;
    strengths.push("content density fits the site type");
  } else {
    score -= 7;
    risks.push("content density feels off for the requested site type");
  }
  if (bodyContrast >= 7) {
    score += 7;
    strengths.push("body contrast is comfortably accessible");
  } else if (bodyContrast >= 4.5) {
    score += 3;
    strengths.push("body contrast passes accessibility baseline");
  } else {
    score -= 18;
    risks.push("body contrast fails accessibility baseline");
  }
  if (uniqueCount(plan.design.intent.personality) >= 3) {
    score += 5;
    strengths.push("personality tags give the compiler useful taste signals");
  }
  if (plan.design.intent.signatureMove.length >= 48) {
    score += 5;
    strengths.push("signature move is specific enough to guide rendering");
  } else {
    score -= 4;
    risks.push("signature move is too thin");
  }
  if (genericCount === 0) {
    score += 5;
    strengths.push("section headings avoid generic defaults");
  } else {
    score -= genericCount * 3;
    risks.push("some section headings still read generic");
  }
  if (hero && query && cta) {
    score += 5;
    strengths.push("homepage has hero, archive, and conversion rhythm");
  }
  if (plan.design.intent.imageTreatment === "none" && query?.cardStyle === "image-led") {
    score -= 8;
    risks.push("image-led cards conflict with the no-image treatment");
  }

  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  return {
    id,
    role,
    plan,
    score: clamped,
    strengths: strengths.slice(0, 5),
    risks: risks.slice(0, 4),
    verdict:
      clamped >= 86
        ? "Strong design candidate"
        : clamped >= 74
          ? "Usable with minor taste risks"
          : "Needs redesign before compilation",
  };
}

export function selectBestCandidate(
  candidates: Array<{ id: string; role: CandidateRole; plan: ThemePlan }>,
  input: NormalizedThemeInput,
): DesignPipelineResult {
  const evaluated = candidates
    .map((candidate) => evaluateDesignCandidate(candidate.id, candidate.role, candidate.plan, input))
    .sort((a, b) => b.score - a.score);
  const selected = evaluated[0];

  return {
    plan: selected.plan,
    selection: {
      selectedId: selected.id,
      selectedScore: selected.score,
      criticSummary: `${selected.verdict}: ${selected.strengths[0] ?? "selected by local design scoring"}.`,
      candidates: evaluated.map(({ plan, ...candidate }) => ({
        ...candidate,
        direction: plan.design.direction,
      })),
    },
  };
}
