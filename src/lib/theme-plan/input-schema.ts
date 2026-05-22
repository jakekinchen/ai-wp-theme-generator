import { z } from "zod";

export const ThemeInputSchema = z.object({
  description: z.string().min(20).max(2000),
  themeName: z.string().min(3).max(80),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  preferredPalette: z.string().max(120).optional(),
  typographyPreference: z.string().max(120).optional(),
  siteType: z.enum(["blog", "portfolio", "agency", "magazine", "newsletter"]).optional(),
  stickyNavigation: z.boolean().optional(),
  includeQueryLoop: z.boolean().optional(),
});

export type ThemeInput = z.input<typeof ThemeInputSchema>;
export type NormalizedThemeInput = z.output<typeof ThemeInputSchema>;
