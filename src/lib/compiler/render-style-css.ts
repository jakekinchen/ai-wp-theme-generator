import { ThemePlan } from "@/lib/theme-plan/types";
import { directionStyleHints } from "./design-tokens";

function headerSafe(value: string): string {
  return value.replace(/[\r\n:*<>?]/g, " ").replace(/\*\//g, "").replace(/\s+/g, " ").trim();
}

const baseRules = `
.site-header {
  align-items: center;
  border-bottom: 1px solid color-mix(in srgb, currentColor 12%, transparent);
}
.site-header.is-sticky {
  position: sticky;
  top: 0;
  z-index: 10;
  backdrop-filter: blur(18px);
  background-color: color-mix(in srgb, var(--wp--preset--color--background) 80%, transparent);
}
.site-header__inner,
.site-footer__inner {
  padding-block: 1rem;
}
.site-footer {
  border-top: 1px solid color-mix(in srgb, currentColor 12%, transparent);
  margin-top: 4rem;
}
.eyebrow {
  font-size: 0.75rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--wp--preset--color--primary);
}
.hero-pattern {
  padding-block: clamp(4rem, 12vw, 10rem);
}
.hero-centered {
  text-align: center;
}
.hero-split .wp-block-columns {
  align-items: center;
  gap: clamp(2rem, 6vw, 5rem);
}
.hero-aside {
  border-left: 2px solid var(--wp--preset--color--primary);
  padding: 1.25rem 1.5rem;
  background-color: var(--wp--preset--color--secondary);
}
.hero-aside__label {
  font-size: 0.7rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
  color: var(--wp--preset--color--muted);
}
.hero-cover {
  background:
    radial-gradient(circle at top left, color-mix(in srgb, var(--wp--preset--color--primary) 28%, transparent), transparent 55%),
    radial-gradient(circle at bottom right, color-mix(in srgb, var(--wp--preset--color--accent) 22%, transparent), transparent 50%),
    var(--wp--preset--color--secondary);
  border-radius: var(--theme-radius-large, 0);
  text-align: center;
}
.hero-editorial {
  border-top: 1px solid currentColor;
  border-bottom: 1px solid currentColor;
}
.hero-editorial .eyebrow.hero-eyebrow--large {
  font-size: 1rem;
}
.hero-editorial .hero-subheading {
  max-width: 38ch;
  opacity: 0.78;
}
.card-bordered > * {
  border: 1px solid color-mix(in srgb, currentColor 15%, transparent);
  border-radius: var(--theme-radius-small, 6px);
  padding: 1.25rem;
  background-color: color-mix(in srgb, var(--wp--preset--color--background) 70%, var(--wp--preset--color--secondary));
}
.card-bordered .wp-block-post-featured-image img {
  border-radius: var(--theme-radius-small, 6px);
}
.card-image-led {
  gap: 2.5rem;
}
.card-image-led .wp-block-post-featured-image {
  margin-bottom: 0.75rem;
}
.card-image-led .wp-block-post-title {
  font-size: clamp(1.5rem, 2vw, 2.25rem);
  line-height: 1.15;
}
.card-magazine {
  gap: 1.25rem;
  border-top: 1px solid color-mix(in srgb, currentColor 25%, transparent);
}
.card-magazine > * {
  border-bottom: 1px solid color-mix(in srgb, currentColor 12%, transparent);
  padding-block: 1rem;
}
.card-magazine .card-magazine__meta {
  color: var(--wp--preset--color--muted);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
}
.card-minimal {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.card-minimal .wp-block-post-title {
  font-weight: 500;
}
.card-meta {
  color: var(--wp--preset--color--muted);
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.split-intro {
  padding-block: 4rem;
}
.cta-band {
  margin-block: 4rem;
  padding: clamp(2rem, 5vw, 4rem);
  background-color: var(--wp--preset--color--secondary);
  border-radius: var(--theme-radius-large, 0);
  text-align: center;
}
.post-header {
  padding-block: 3rem;
  display: grid;
  gap: 1rem;
}
`;

export function renderStyleCss(plan: ThemePlan): string {
  const hints = directionStyleHints(plan.design.direction);
  const densityGap = plan.design.intent.contentDensity === "high" ? "0.75rem" : plan.design.intent.contentDensity === "low" ? "2rem" : "1.25rem";
  const surfaceShadow = plan.design.intent.surface === "layered" ? "0 20px 60px color-mix(in srgb, currentColor 10%, transparent)" : "none";
  const radiusSmall = plan.design.layout.radius === "none" ? "0" : plan.design.layout.radius === "pill" ? "999px" : plan.design.layout.radius === "rounded" ? "14px" : "6px";
  const radiusLarge = plan.design.layout.radius === "none" ? "0" : plan.design.layout.radius === "pill" ? "999px" : plan.design.layout.radius === "rounded" ? "24px" : "12px";
  return `/*
Theme Name: ${headerSafe(plan.meta.name)}
Theme URI: https://example.com
Author: ${headerSafe(plan.meta.author)}
Description: ${headerSafe(plan.meta.description)}
Version: 1.0.0
Requires at least: 6.6
Tested up to: 6.6
Requires PHP: 7.4
Text Domain: ${headerSafe(plan.meta.slug)}
*/

:root {
  --theme-radius-small: ${radiusSmall};
  --theme-radius-large: ${radiusLarge};
}

body {
  letter-spacing: ${hints.bodyLetterSpacing};
}

.wp-block-post-title,
:where(h1, h2, h3, h4) {
  letter-spacing: ${hints.headingLetterSpacing};
  font-weight: ${hints.headingWeight};
}

${baseRules}

.site-header {
  ${hints.headerExtra}
}

.hero-pattern {
  ${hints.heroExtra}
}

.hero-pattern.image-framed,
.surface-layered > * {
  box-shadow: ${surfaceShadow};
}

.hero-pattern.image-bleed {
  margin-inline: calc(50% - 50vw);
  padding-inline: max(2rem, calc((100vw - var(--wp--style--global--wide-size)) / 2));
}

.hero-pattern.image-duotone-field {
  filter: saturate(0.86) contrast(1.08);
}

.hierarchy-dramatic h1 {
  font-size: clamp(3.4rem, 10vw, 7.5rem);
}

.hierarchy-dense h1 {
  font-size: clamp(2.2rem, 6vw, 4.5rem);
  text-transform: uppercase;
}

.density-high .wp-block-post-template {
  gap: ${densityGap};
}

.density-low .wp-block-post-template {
  gap: ${densityGap};
}

.nav-index {
  font-family: var(--wp--preset--font-family--heading);
  text-transform: uppercase;
}

.nav-portfolio {
  letter-spacing: 0.24em;
  text-transform: uppercase;
}
`;
}
