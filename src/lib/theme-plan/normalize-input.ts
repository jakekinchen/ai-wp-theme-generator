import { ThemeInput, ThemeInputSchema, NormalizedThemeInput } from "./input-schema";

const dangerousPatterns = [
  /<!--\s*wp:html/i,
  /core\/html/i,
  /wp:html/i,
  /<!--\s*wp:freeform/i,
  /core\/freeform/i,
  /wp:freeform/i,
];

export function sanitizeUserString(value: string): string {
  return value
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/<\?(?:php)?/gi, "")
    .replace(/\?>/g, "")
    .replace(/\*\//g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeThemeInput(input: ThemeInput): NormalizedThemeInput {
  const candidate = {
    ...input,
    description: sanitizeUserString(String(input.description ?? "")),
    themeName: sanitizeUserString(String(input.themeName ?? "")),
    slug: sanitizeUserString(String(input.slug ?? "")).toLowerCase(),
    preferredPalette:
      input.preferredPalette === undefined ? undefined : sanitizeUserString(input.preferredPalette),
    typographyPreference:
      input.typographyPreference === undefined
        ? undefined
        : sanitizeUserString(input.typographyPreference),
    stickyNavigation: input.stickyNavigation ?? true,
    includeQueryLoop: input.includeQueryLoop ?? true,
  };

  const joined = Object.values(candidate).filter((value) => typeof value === "string").join("\n");
  if (dangerousPatterns.some((pattern) => pattern.test(joined))) {
    throw new Error("Input contains unsupported WordPress block or PHP-like content.");
  }

  return ThemeInputSchema.parse(candidate);
}
