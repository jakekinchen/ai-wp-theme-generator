export type SampleBrief = {
  themeName: string;
  slug: string;
  description: string;
  siteType: "blog" | "portfolio" | "agency" | "magazine" | "newsletter";
  preferredPalette: string;
  typographyPreference: string;
  stickyNavigation: boolean;
  includeQueryLoop: boolean;
};

export const sampleBriefs: SampleBrief[] = [
  {
    themeName: "Obsidian Lens",
    slug: "obsidian-lens",
    description:
      "A dark mode blog theme for photographers with a large centered hero, sticky navigation, oversized image-led post cards, and warm editorial typography.",
    siteType: "blog",
    preferredPalette: "dark editorial with warm amber accents",
    typographyPreference: "large serif headings with readable sans body",
    stickyNavigation: true,
    includeQueryLoop: true,
  },
  {
    themeName: "Plain Signal",
    slug: "plain-signal",
    description:
      "A minimalist agency site for strategy work — restrained color, clear archive cards, balanced spacing, and a confident sans system.",
    siteType: "agency",
    preferredPalette: "near-white with a single cobalt accent",
    typographyPreference: "geometric sans throughout",
    stickyNavigation: false,
    includeQueryLoop: true,
  },
  {
    themeName: "Archive Daily",
    slug: "archive-daily",
    description:
      "A dense magazine archive with daily dispatches — strong metadata, mixed hierarchy, four-up story grid, and high-contrast cards.",
    siteType: "magazine",
    preferredPalette: "bright white with crimson and ink",
    typographyPreference: "serif headings with tight sans metadata",
    stickyNavigation: true,
    includeQueryLoop: true,
  },
  {
    themeName: "Kitchen Table Mail",
    slug: "kitchen-table-mail",
    description:
      "A warm newsletter for recipes and weekend dispatches — cream backgrounds, terracotta accents, friendly rounded shapes, and one calm story column.",
    siteType: "newsletter",
    preferredPalette: "cream with terracotta and sage",
    typographyPreference: "soft serif with handwritten italic accents",
    stickyNavigation: false,
    includeQueryLoop: false,
  },
  {
    themeName: "Block Press",
    slug: "block-press",
    description:
      "A brutalist index of industrial design notes — stark yellow paper, ink type, sharp borders, mono labels everywhere, and a tight content density.",
    siteType: "blog",
    preferredPalette: "industrial yellow with deep ink",
    typographyPreference: "mono for everything, no exceptions",
    stickyNavigation: true,
    includeQueryLoop: true,
  },
  {
    themeName: "Atelier Sainte-Croix",
    slug: "atelier-sainte-croix",
    description:
      "A luxury fashion portfolio with sweeping selected works, hairline rules, generous whitespace, and quiet warm neutrals.",
    siteType: "portfolio",
    preferredPalette: "muted warm neutrals with deep forest accent",
    typographyPreference: "thin display serif with a refined sans body",
    stickyNavigation: false,
    includeQueryLoop: true,
  },
  {
    themeName: "Quiet Studio",
    slug: "quiet-studio",
    description:
      "A soft studio voice for a small product design practice — warm beige, gentle contrast, rounded cards, and a balanced editorial rhythm.",
    siteType: "agency",
    preferredPalette: "warm beige with sage and rust",
    typographyPreference: "humanist sans with serif italics",
    stickyNavigation: true,
    includeQueryLoop: true,
  },
  {
    themeName: "Field Notes",
    slug: "field-notes",
    description:
      "An outdoor photography journal with cinematic frames, large centered hero, image-led story cards, and field-guide typography.",
    siteType: "blog",
    preferredPalette: "moody charcoal with amber and bone",
    typographyPreference: "tall serif headings with mono metadata",
    stickyNavigation: true,
    includeQueryLoop: true,
  },
  {
    themeName: "Tessitura",
    slug: "tessitura",
    description:
      "A magazine archive for Italian fashion criticism — dense four-up grid, strong red accent, serif display, and small sans metadata.",
    siteType: "magazine",
    preferredPalette: "bone white with vermilion and ink",
    typographyPreference: "Didone-style serif with tight sans labels",
    stickyNavigation: true,
    includeQueryLoop: true,
  },
  {
    themeName: "Sundial",
    slug: "sundial",
    description:
      "A weekly newsletter for slow living — cream pages, single story column, warm spice accents, and a calm subscribe band at the end.",
    siteType: "newsletter",
    preferredPalette: "cream with cinnamon and forest",
    typographyPreference: "old-style serif throughout",
    stickyNavigation: false,
    includeQueryLoop: false,
  },
  {
    themeName: "Currents Practice",
    slug: "currents-practice",
    description:
      "A portfolio for a research-led product practice — premium feel, generous whitespace, two-up project grid, and a quiet serif voice.",
    siteType: "portfolio",
    preferredPalette: "ivory with deep navy and gold leaf",
    typographyPreference: "large serif display with a refined sans body",
    stickyNavigation: false,
    includeQueryLoop: true,
  },
  {
    themeName: "Index One",
    slug: "index-one",
    description:
      "A brutalist agency intro page with stark borders, mono labels, hard-edge buttons, and a no-nonsense three-up project list.",
    siteType: "agency",
    preferredPalette: "high-contrast yellow with ink",
    typographyPreference: "mono labels with grotesk headings",
    stickyNavigation: true,
    includeQueryLoop: true,
  },
];

export function pickRandomBrief(excludeSlug?: string): SampleBrief {
  const pool = excludeSlug
    ? sampleBriefs.filter((brief) => brief.slug !== excludeSlug)
    : sampleBriefs;
  return pool[Math.floor(Math.random() * pool.length)];
}
