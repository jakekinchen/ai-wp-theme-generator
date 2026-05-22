import { ThemePlan } from "@/lib/theme-plan/types";

export function fontStack(font: ThemePlan["design"]["typography"]["headingFont"]): string {
  if (font === "serif") return "Georgia, Cambria, Times New Roman, serif";
  if (font === "mono") return "Menlo, Monaco, Consolas, Liberation Mono, monospace";
  return "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
}

export function radiusValue(radius: ThemePlan["design"]["layout"]["radius"]): string {
  return {
    none: "0",
    subtle: "6px",
    rounded: "14px",
    pill: "999px",
  }[radius];
}

type DirectionHints = {
  headingLetterSpacing: string;
  bodyLetterSpacing: string;
  headingWeight: string;
  heroExtra: string;
  headerExtra: string;
};

const map: Record<ThemePlan["design"]["direction"], DirectionHints> = {
  "editorial-noir": {
    headingLetterSpacing: "-0.02em",
    bodyLetterSpacing: "0.01em",
    headingWeight: "500",
    heroExtra: "background: linear-gradient(180deg, color-mix(in srgb, var(--wp--preset--color--background) 92%, var(--wp--preset--color--primary) 8%), var(--wp--preset--color--background));",
    headerExtra: "text-transform: uppercase; letter-spacing: 0.18em; font-size: 0.8rem;",
  },
  "soft-studio": {
    headingLetterSpacing: "-0.01em",
    bodyLetterSpacing: "0",
    headingWeight: "500",
    heroExtra: "background: var(--wp--preset--color--secondary);",
    headerExtra: "font-weight: 500;",
  },
  "brutalist-index": {
    headingLetterSpacing: "0",
    bodyLetterSpacing: "0",
    headingWeight: "700",
    heroExtra: "border: 6px solid var(--wp--preset--color--foreground); padding-block: 5rem; text-transform: uppercase;",
    headerExtra: "text-transform: uppercase; font-weight: 700; letter-spacing: 0.04em;",
  },
  "luxury-portfolio": {
    headingLetterSpacing: "-0.015em",
    bodyLetterSpacing: "0.02em",
    headingWeight: "400",
    heroExtra: "padding-block: clamp(6rem, 14vw, 14rem); border-bottom: 1px solid currentColor;",
    headerExtra: "font-size: 0.75rem; letter-spacing: 0.32em; text-transform: uppercase;",
  },
  "magazine-archive": {
    headingLetterSpacing: "-0.02em",
    bodyLetterSpacing: "0",
    headingWeight: "700",
    heroExtra: "padding-block: 3rem; border-bottom: 2px solid var(--wp--preset--color--foreground);",
    headerExtra: "border-bottom: 2px solid currentColor; font-weight: 700;",
  },
  "minimalist-agency": {
    headingLetterSpacing: "-0.015em",
    bodyLetterSpacing: "0",
    headingWeight: "600",
    heroExtra: "padding-block: clamp(5rem, 10vw, 9rem);",
    headerExtra: "font-weight: 500;",
  },
  "warm-newsletter": {
    headingLetterSpacing: "-0.005em",
    bodyLetterSpacing: "0.01em",
    headingWeight: "500",
    heroExtra: "background: color-mix(in srgb, var(--wp--preset--color--secondary) 60%, var(--wp--preset--color--background)); border-radius: 24px;",
    headerExtra: "font-style: italic; font-weight: 500;",
  },
};

export function directionStyleHints(direction: ThemePlan["design"]["direction"]): DirectionHints {
  return map[direction];
}
