import { z } from "zod";

const hexColor = z.string().regex(/^#[0-9a-fA-F]{6}$/, "Use a 6-digit hex color.");

export const DesignDirectionSchema = z.enum([
  "editorial-noir",
  "soft-studio",
  "brutalist-index",
  "luxury-portfolio",
  "magazine-archive",
  "minimalist-agency",
  "warm-newsletter",
]);

export const DesignPersonalitySchema = z.enum([
  "cinematic",
  "calm",
  "precise",
  "archival",
  "premium",
  "warm",
  "stark",
  "literary",
  "utilitarian",
  "expressive",
]);

export const DesignIntentSchema = z.object({
  audience: z.string().min(8).max(160),
  personality: z.array(DesignPersonalitySchema).min(2).max(5),
  hierarchy: z.enum(["quiet", "balanced", "dramatic", "dense"]),
  contentDensity: z.enum(["low", "medium", "high"]),
  imageTreatment: z.enum(["none", "framed", "bleed", "editorial-crop", "duotone-field"]),
  rhythm: z.enum(["linear", "alternating", "front-loaded", "archive-first"]),
  navStyle: z.enum(["minimal", "editorial", "index", "portfolio"]),
  surface: z.enum(["flat", "bordered", "layered", "paper"]),
  signatureMove: z.string().min(12).max(180),
});

export const HeroSectionSchema = z.object({
  kind: z.literal("hero"),
  eyebrow: z.string().min(1).max(80),
  heading: z.string().min(3).max(140),
  subheading: z.string().min(10).max(320),
  primaryButtonLabel: z.string().min(1).max(60).nullable(),
  primaryButtonUrl: z.string().min(1).max(200).nullable(),
  visualStyle: z.enum(["centered", "split", "cover", "editorial"]),
});

export const SplitIntroSectionSchema = z.object({
  kind: z.literal("split-intro"),
  heading: z.string().min(3).max(140),
  body: z.string().min(20).max(600),
  aside: z.string().min(3).max(180),
});

export const QueryGridSectionSchema = z.object({
  kind: z.literal("query-grid"),
  heading: z.string().min(3).max(140),
  columns: z.union([z.literal(2), z.literal(3), z.literal(4)]),
  showExcerpt: z.boolean(),
  showDate: z.boolean(),
  cardStyle: z.enum(["bordered", "image-led", "minimal", "magazine"]),
});

export const CtaBandSectionSchema = z.object({
  kind: z.literal("cta-band"),
  heading: z.string().min(3).max(140),
  body: z.string().min(10).max(320),
  buttonLabel: z.string().min(1).max(60),
  buttonUrl: z.string().min(1).max(200),
});

export const ThemeSectionSchema = z.discriminatedUnion("kind", [
  HeroSectionSchema,
  SplitIntroSectionSchema,
  QueryGridSectionSchema,
  CtaBandSectionSchema,
]);

const templateComposition = z.array(z.string().min(1).max(80)).min(1).max(12);

export const ThemePlanSchema = z.object({
  meta: z.object({
    name: z.string().min(3).max(80),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    description: z.string().min(10).max(240),
    author: z.string().min(1).max(80),
  }),
  design: z.object({
    direction: DesignDirectionSchema,
    rationale: z.string().min(20).max(600),
    intent: DesignIntentSchema,
    palette: z.object({
      background: hexColor,
      foreground: hexColor,
      primary: hexColor,
      secondary: hexColor,
      muted: hexColor,
      accent: hexColor,
    }),
    typography: z.object({
      headingFont: z.enum(["serif", "sans", "mono"]),
      bodyFont: z.enum(["serif", "sans", "mono"]),
      scale: z.enum(["compact", "balanced", "dramatic"]),
    }),
    layout: z.object({
      contentWidth: z.number().min(620).max(920),
      wideWidth: z.number().min(1000).max(1480),
      spacing: z.enum(["tight", "balanced", "spacious"]),
      radius: z.enum(["none", "subtle", "rounded", "pill"]),
    }),
  }),
  navigation: z.object({
    sticky: z.boolean(),
  }),
  homepage: z.array(ThemeSectionSchema).min(3).max(7),
  templates: z.object({
    home: templateComposition,
    index: templateComposition,
    single: templateComposition,
    page: templateComposition,
    archive: templateComposition,
    search: templateComposition,
    notFound: templateComposition,
  }),
});
