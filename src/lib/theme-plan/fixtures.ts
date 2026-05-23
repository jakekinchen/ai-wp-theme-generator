import { intentFromRecipe, recipeForDirection } from "@/lib/design/recipes";
import { directionDefaults } from "./defaults";
import { ThemePlan } from "./types";

type DirectionKey = keyof typeof directionDefaults;

type SectionInput = {
  themeName: string;
  description: string;
  direction: DirectionKey;
  siteType: string;
  stickyNavigation: boolean;
};

const directionRationales: Record<DirectionKey, string> = {
  "editorial-noir":
    "A matte dark editorial system gives photography and long-form essays room to dominate while warm accents and large serif display type keep the experience distinctive and readable.",
  "soft-studio":
    "Warm neutrals, gentle contrast, and rounded edges keep this studio voice calm, approachable, and friendly to mixed text and imagery.",
  "brutalist-index":
    "Stark yellow and ink build a confident archival voice: mono labels, sharp borders, and a tight grid that puts content density first.",
  "luxury-portfolio":
    "Generous whitespace, hairline rules, and a quiet warm-neutral palette let portfolio imagery and serif headings feel premium without ornament.",
  "magazine-archive":
    "A dense editorial grid with strong metadata, mixed hierarchy, and high-contrast cards supports a magazine archive that updates daily.",
  "minimalist-agency":
    "A precise sans system with restrained color and balanced spacing keeps an agency story clear, fast to scan, and easy to extend.",
  "warm-newsletter":
    "Warm cream backgrounds, terracotta accents, and rounded shapes evoke a printed newsletter that feels personal, even on the web.",
};

const directionEyebrows: Record<DirectionKey, string> = {
  "editorial-noir": "Field notes and frames",
  "soft-studio": "Studio dispatches",
  "brutalist-index": "Index — current issue",
  "luxury-portfolio": "Selected work",
  "magazine-archive": "Today's edition",
  "minimalist-agency": "Practice notes",
  "warm-newsletter": "From the kitchen table",
};

const siteTypeDirectionHints: Record<string, DirectionKey> = {
  blog: "editorial-noir",
  portfolio: "luxury-portfolio",
  agency: "minimalist-agency",
  magazine: "magazine-archive",
  newsletter: "warm-newsletter",
};

export function chooseDirection(input?: { description?: string; siteType?: string; preferredPalette?: string }): DirectionKey {
  if (input?.siteType && siteTypeDirectionHints[input.siteType]) return siteTypeDirectionHints[input.siteType];
  const text = `${input?.description ?? ""} ${input?.preferredPalette ?? ""}`.toLowerCase();
  if (/dark|noir|moody|photograph|cinema/.test(text)) return "editorial-noir";
  if (/brutal|stark|industrial/.test(text)) return "brutalist-index";
  if (/luxur|premium|atelier|fashion|gallery/.test(text)) return "luxury-portfolio";
  if (/magazine|daily|dispatch|edition/.test(text)) return "magazine-archive";
  if (/agency|consult|product|saas|startup/.test(text)) return "minimalist-agency";
  if (/newsletter|kitchen|recipe|warm|cream|terracotta/.test(text)) return "warm-newsletter";
  if (/studio|warm neutral|soft|gentle/.test(text)) return "soft-studio";
  return "editorial-noir";
}

function heroSection(context: SectionInput) {
  const recipe = recipeForDirection(context.direction);
  const navAside = context.stickyNavigation ? "with sticky navigation" : "with classic navigation";
  return {
    kind: "hero" as const,
    eyebrow: directionEyebrows[context.direction],
    heading: heroHeading(context),
    subheading: `An honest, ${context.direction.replace("-", " ")} reading experience ${navAside}, generated from a constrained design plan.`,
    primaryButtonLabel: context.siteType === "newsletter" ? "Subscribe" : "Read the latest",
    primaryButtonUrl: "/",
    visualStyle: recipe.heroVisual,
  };
}

function heroHeading(context: SectionInput): string {
  const name = context.themeName;
  if (context.direction === "editorial-noir") return `${name}: a cinematic field journal`;
  if (context.direction === "brutalist-index") return `${name} / Index 01`;
  if (context.direction === "luxury-portfolio") return `${name} — Selected works`;
  if (context.direction === "magazine-archive") return `${name} Daily — front page`;
  if (context.direction === "minimalist-agency") return `${name}: design practice for clear products`;
  if (context.direction === "warm-newsletter") return `Warm dispatches from ${name}`;
  return `${name} — a calm studio voice`;
}

function splitIntroSection(context: SectionInput) {
  return {
    kind: "split-intro" as const,
    heading: `What ${context.themeName} is for`,
    body: `${context.description.slice(0, 240)} The compiler will turn this plan into a safe block theme without inventing arbitrary HTML.`,
    aside: context.stickyNavigation ? "Sticky navigation" : "Classic navigation",
  };
}

function queryGridSection(context: SectionInput) {
  const recipe = recipeForDirection(context.direction);
  return {
    kind: "query-grid" as const,
    heading: context.siteType === "magazine" ? "Recent dispatches" : "Latest stories",
    columns: recipe.columns,
    showExcerpt: recipe.excerpt,
    showDate: true,
    cardStyle: recipe.cardStyle,
  };
}

function ctaSection(context: SectionInput) {
  return {
    kind: "cta-band" as const,
    heading: context.siteType === "newsletter" ? "Subscribe to the next issue" : "Keep exploring",
    body: `Invite readers to follow ${context.themeName} without adding a heavy platform or third-party scripts.`,
    buttonLabel: context.siteType === "newsletter" ? "Subscribe" : "See archive",
    buttonUrl: "/",
  };
}

export function buildFixtureThemePlan(input?: {
  themeName?: string;
  slug?: string;
  description?: string;
  preferredPalette?: string;
  siteType?: string;
  stickyNavigation?: boolean;
  includeQueryLoop?: boolean;
}): ThemePlan {
  const direction = chooseDirection(input);
  return buildThemePlanForDirection(direction, input);
}

export function buildThemePlanForDirection(direction: DirectionKey, input?: {
  themeName?: string;
  slug?: string;
  description?: string;
  preferredPalette?: string;
  siteType?: string;
  stickyNavigation?: boolean;
  includeQueryLoop?: boolean;
}): ThemePlan {
  const defaults = directionDefaults[direction];
  const recipe = recipeForDirection(direction);
  const name = input?.themeName?.trim() || "Obsidian Lens";
  const slug = input?.slug?.trim() || "obsidian-lens";
  const description =
    input?.description?.trim() ||
    "A dark editorial photography blog with sticky navigation and large image-led story cards.";
  const sticky = input?.stickyNavigation ?? true;
  const includeQuery = input?.includeQueryLoop ?? true;
  const context: SectionInput = {
    themeName: name,
    description,
    direction,
    siteType: input?.siteType ?? "blog",
    stickyNavigation: sticky,
  };

  const homepage = [
    heroSection(context),
    splitIntroSection(context),
    ...(includeQuery ? [queryGridSection(context)] : []),
    ctaSection(context),
  ];

  return {
    meta: {
      name,
      slug,
      description: description.slice(0, 240),
      author: "AI Theme Generator",
    },
    design: {
      direction,
      rationale: directionRationales[direction],
      intent: intentFromRecipe(recipe),
      palette: { ...defaults.palette },
      typography: { ...defaults.typography },
      layout: { ...defaults.layout },
    },
    navigation: { sticky },
    homepage,
    templates: {
      home: ["header", "hero", "split-intro", "featured-query", "cta-band", "footer"],
      index: ["header", "hero", "featured-query", "footer"],
      single: ["header", "post-header", "post-content", "footer"],
      page: ["header", "post-header", "post-content", "footer"],
      archive: ["header", "archive-query", "footer"],
      search: ["header", "archive-query", "footer"],
      notFound: ["header", "404", "footer"],
    },
  };
}
