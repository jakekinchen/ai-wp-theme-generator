import { block } from "../serialize-block";
import { renderButtonsBlock } from "./buttons";
import { renderHeadingBlock } from "./heading";
import { renderParagraphBlock } from "./paragraph";

export type HeroInput = {
  eyebrow: string;
  heading: string;
  subheading: string;
  primaryButtonLabel: string | null;
  primaryButtonUrl: string | null;
  visualStyle: "centered" | "split" | "cover" | "editorial";
};

function ctaBlock(input: HeroInput, align: "left" | "center"): string {
  if (!input.primaryButtonLabel || !input.primaryButtonUrl) return "";
  return renderButtonsBlock(input.primaryButtonLabel, input.primaryButtonUrl, align);
}

function centeredHero(input: HeroInput): string {
  const inner = [
    renderParagraphBlock({ content: input.eyebrow, align: "center", className: "eyebrow" }),
    renderHeadingBlock({ content: input.heading, level: 1, align: "center" }),
    renderParagraphBlock({ content: input.subheading, align: "center" }),
    ctaBlock(input, "center"),
  ].filter(Boolean).join("\n");
  return block(
    "group",
    { tagName: "section", className: "hero-pattern hero-centered", layout: { type: "constrained" } },
    `<section class="wp-block-group hero-pattern hero-centered">\n${inner}\n</section>`,
  );
}

function splitHero(input: HeroInput): string {
  const textColumn = block(
    "column",
    { width: "60%" },
    [
      renderParagraphBlock({ content: input.eyebrow, className: "eyebrow" }),
      renderHeadingBlock({ content: input.heading, level: 1 }),
      renderParagraphBlock({ content: input.subheading }),
      ctaBlock(input, "left"),
    ].filter(Boolean).join("\n"),
  );
  const asideColumn = block(
    "column",
    { width: "40%" },
    block(
      "group",
      { className: "hero-aside", layout: { type: "constrained" } },
      `<div class="wp-block-group hero-aside">\n${renderParagraphBlock({ content: "Studio brief" , className: "hero-aside__label" })}\n${renderParagraphBlock({ content: input.eyebrow })}\n</div>`,
    ),
  );
  return block(
    "group",
    { tagName: "section", className: "hero-pattern hero-split", layout: { type: "constrained" } },
    `<section class="wp-block-group hero-pattern hero-split">\n${block("columns", { verticalAlignment: "center" }, [textColumn, asideColumn].join("\n"))}\n</section>`,
  );
}

function coverHero(input: HeroInput): string {
  const inner = [
    renderParagraphBlock({ content: input.eyebrow, align: "center", className: "eyebrow" }),
    renderHeadingBlock({ content: input.heading, level: 1, align: "center" }),
    renderParagraphBlock({ content: input.subheading, align: "center" }),
    ctaBlock(input, "center"),
  ].filter(Boolean).join("\n");
  return block(
    "group",
    { tagName: "section", className: "hero-pattern hero-cover", layout: { type: "constrained" } },
    `<section class="wp-block-group hero-pattern hero-cover">\n${inner}\n</section>`,
  );
}

function editorialHero(input: HeroInput): string {
  const inner = [
    renderParagraphBlock({ content: input.eyebrow, className: "eyebrow hero-eyebrow--large" }),
    renderHeadingBlock({ content: input.heading, level: 1 }),
    block("separator", { className: "is-style-wide" }),
    renderParagraphBlock({ content: input.subheading, className: "hero-subheading" }),
    ctaBlock(input, "left"),
  ].filter(Boolean).join("\n");
  return block(
    "group",
    { tagName: "section", className: "hero-pattern hero-editorial", layout: { type: "constrained" } },
    `<section class="wp-block-group hero-pattern hero-editorial">\n${inner}\n</section>`,
  );
}

export function renderHero(input: HeroInput): string {
  if (input.visualStyle === "split") return splitHero(input);
  if (input.visualStyle === "cover") return coverHero(input);
  if (input.visualStyle === "editorial") return editorialHero(input);
  return centeredHero(input);
}
