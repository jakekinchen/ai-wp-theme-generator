import { ThemePlan } from "@/lib/theme-plan/types";

export type DesignRecipe = {
  direction: ThemePlan["design"]["direction"];
  audience: string;
  personality: ThemePlan["design"]["intent"]["personality"];
  hierarchy: ThemePlan["design"]["intent"]["hierarchy"];
  contentDensity: ThemePlan["design"]["intent"]["contentDensity"];
  imageTreatment: ThemePlan["design"]["intent"]["imageTreatment"];
  rhythm: ThemePlan["design"]["intent"]["rhythm"];
  navStyle: ThemePlan["design"]["intent"]["navStyle"];
  surface: ThemePlan["design"]["intent"]["surface"];
  signatureMove: string;
  heroVisual: Extract<ThemePlan["homepage"][number], { kind: "hero" }>["visualStyle"];
  cardStyle: Extract<ThemePlan["homepage"][number], { kind: "query-grid" }>["cardStyle"];
  columns: Extract<ThemePlan["homepage"][number], { kind: "query-grid" }>["columns"];
  excerpt: boolean;
};

export const designRecipes: Record<ThemePlan["design"]["direction"], DesignRecipe> = {
  "editorial-noir": {
    direction: "editorial-noir",
    audience: "photographers, essayists, and readers who want cinematic long-form stories",
    personality: ["cinematic", "literary", "warm"],
    hierarchy: "dramatic",
    contentDensity: "medium",
    imageTreatment: "editorial-crop",
    rhythm: "front-loaded",
    navStyle: "editorial",
    surface: "layered",
    signatureMove: "a centered cinematic hero followed by image-led story cards with warm metadata",
    heroVisual: "centered",
    cardStyle: "image-led",
    columns: 3,
    excerpt: true,
  },
  "soft-studio": {
    direction: "soft-studio",
    audience: "small studios and makers who need a gentle but polished editorial home",
    personality: ["calm", "warm", "precise"],
    hierarchy: "balanced",
    contentDensity: "medium",
    imageTreatment: "framed",
    rhythm: "alternating",
    navStyle: "minimal",
    surface: "layered",
    signatureMove: "rounded cards and an alternating split intro that makes the studio voice feel tactile",
    heroVisual: "split",
    cardStyle: "bordered",
    columns: 3,
    excerpt: true,
  },
  "brutalist-index": {
    direction: "brutalist-index",
    audience: "archive readers who prefer sharp indexing, dense scans, and direct navigation",
    personality: ["stark", "archival", "utilitarian"],
    hierarchy: "dense",
    contentDensity: "high",
    imageTreatment: "none",
    rhythm: "archive-first",
    navStyle: "index",
    surface: "bordered",
    signatureMove: "hard black borders, mono labels, and a compressed index grid that refuses decoration",
    heroVisual: "editorial",
    cardStyle: "minimal",
    columns: 4,
    excerpt: false,
  },
  "luxury-portfolio": {
    direction: "luxury-portfolio",
    audience: "portfolio visitors evaluating premium creative work and visual craft",
    personality: ["premium", "calm", "cinematic"],
    hierarchy: "quiet",
    contentDensity: "low",
    imageTreatment: "bleed",
    rhythm: "linear",
    navStyle: "portfolio",
    surface: "flat",
    signatureMove: "large quiet negative space with a cover-like hero and oversized image-led entries",
    heroVisual: "cover",
    cardStyle: "image-led",
    columns: 2,
    excerpt: true,
  },
  "magazine-archive": {
    direction: "magazine-archive",
    audience: "daily readers who scan headlines, metadata, and recurring editorial departments",
    personality: ["archival", "expressive", "precise"],
    hierarchy: "dense",
    contentDensity: "high",
    imageTreatment: "framed",
    rhythm: "archive-first",
    navStyle: "index",
    surface: "bordered",
    signatureMove: "front-page hierarchy with a four-up magazine grid and loud metadata rails",
    heroVisual: "editorial",
    cardStyle: "magazine",
    columns: 4,
    excerpt: true,
  },
  "minimalist-agency": {
    direction: "minimalist-agency",
    audience: "clients comparing strategy, design systems, and product case studies",
    personality: ["precise", "utilitarian", "calm"],
    hierarchy: "balanced",
    contentDensity: "medium",
    imageTreatment: "framed",
    rhythm: "linear",
    navStyle: "minimal",
    surface: "flat",
    signatureMove: "a disciplined split hero and bordered proof cards tuned for fast client scanning",
    heroVisual: "split",
    cardStyle: "bordered",
    columns: 3,
    excerpt: true,
  },
  "warm-newsletter": {
    direction: "warm-newsletter",
    audience: "newsletter readers looking for a personal, cozy, recurring dispatch",
    personality: ["warm", "literary", "calm"],
    hierarchy: "balanced",
    contentDensity: "low",
    imageTreatment: "framed",
    rhythm: "linear",
    navStyle: "minimal",
    surface: "paper",
    signatureMove: "paper-like surfaces, rounded calls to action, and a slower two-column story rhythm",
    heroVisual: "centered",
    cardStyle: "minimal",
    columns: 2,
    excerpt: false,
  },
};

export function recipeForDirection(direction: ThemePlan["design"]["direction"]): DesignRecipe {
  return designRecipes[direction];
}

export function intentFromRecipe(recipe: DesignRecipe): ThemePlan["design"]["intent"] {
  return {
    audience: recipe.audience,
    personality: [...recipe.personality],
    hierarchy: recipe.hierarchy,
    contentDensity: recipe.contentDensity,
    imageTreatment: recipe.imageTreatment,
    rhythm: recipe.rhythm,
    navStyle: recipe.navStyle,
    surface: recipe.surface,
    signatureMove: recipe.signatureMove,
  };
}
