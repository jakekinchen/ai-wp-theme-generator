import { ThemePlan, ThemeSection } from "@/lib/theme-plan/types";
import { block, escapeHtml } from "../serialize-block";
import { renderButtonsBlock } from "./buttons";
import { renderGroupBlock } from "./group";
import { renderHeadingBlock } from "./heading";
import { renderHero } from "./hero";
import { renderParagraphBlock } from "./paragraph";
import { renderQueryBlock } from "./query";

function patternHeader(title: string, slug: string, categories = "featured"): string {
  return `<?php\n/**\n * Title: ${escapeHtml(title)}\n * Slug: ${escapeHtml(slug)}\n * Categories: ${escapeHtml(categories)}\n */\n?>`;
}

export function renderHeaderPart(plan: ThemePlan): string {
  const inner = [
    block("site-title", { level: 0 }),
    block("navigation", { overlayMenu: "mobile" }, block("page-list", {})),
  ].join("\n");
  const className = plan.navigation.sticky ? "site-header is-sticky" : "site-header";
  return block("group", { tagName: "header", className, layout: { type: "flex", justifyContent: "space-between" } }, `<div class="wp-block-group site-header__inner">\n${inner}\n</div>`);
}

export function renderFooterPart(plan: ThemePlan): string {
  const inner = [
    block("site-title", {}),
    renderParagraphBlock({ content: `${plan.meta.name} publishes distinctive stories with a safe generated block theme.` }),
    block("navigation", {}, block("page-list", {})),
  ].join("\n");
  return block("group", { tagName: "footer", className: "site-footer", layout: { type: "constrained" } }, `<div class="wp-block-group site-footer__inner">\n${inner}\n</div>`);
}

export function renderHeroPattern(plan: ThemePlan): string {
  const hero = plan.homepage.find((section): section is Extract<ThemeSection, { kind: "hero" }> => section.kind === "hero")!;
  return [patternHeader("Hero", `${plan.meta.slug}/hero`), renderHero(hero)].join("\n");
}

export function renderSplitIntroPattern(plan: ThemePlan): string {
  const split = plan.homepage.find((section): section is Extract<ThemeSection, { kind: "split-intro" }> => section.kind === "split-intro");
  const section = split ?? { heading: "A clear editorial system", body: plan.design.rationale, aside: plan.design.direction };
  const columnOne = block("column", {}, [renderHeadingBlock({ content: section.heading, level: 2 }), renderParagraphBlock({ content: section.body })].join("\n"));
  const columnTwo = block("column", {}, renderParagraphBlock({ content: section.aside }));
  return [patternHeader("Split Intro", `${plan.meta.slug}/split-intro`), block("columns", { className: "split-intro" }, [columnOne, columnTwo].join("\n"))].join("\n");
}

export function renderFeaturedQueryPattern(plan: ThemePlan): string {
  const query = plan.homepage.find((section): section is Extract<ThemeSection, { kind: "query-grid" }> => section.kind === "query-grid");
  const cardStyle = query?.cardStyle ?? "bordered";
  return [patternHeader("Featured Query", `${plan.meta.slug}/featured-query`, "query"), renderGroupBlock(renderQueryBlock({
    heading: query?.heading ?? "Latest posts",
    columns: query?.columns ?? 3,
    showDate: query?.showDate ?? true,
    showExcerpt: query?.showExcerpt ?? true,
    cardStyle,
  }), `query-${cardStyle}`)].join("\n");
}

export function renderArchiveQueryPattern(plan: ThemePlan): string {
  const query = plan.homepage.find((section): section is Extract<ThemeSection, { kind: "query-grid" }> => section.kind === "query-grid");
  const cardStyle = query?.cardStyle ?? "bordered";
  return [patternHeader("Archive Query", `${plan.meta.slug}/archive-query`, "query"), renderGroupBlock(renderQueryBlock({
    heading: "Archive",
    columns: query?.columns ?? 3,
    showDate: true,
    showExcerpt: true,
    cardStyle,
  }), `archive-query query-${cardStyle}`)].join("\n");
}

export function renderPostHeaderPattern(plan: ThemePlan): string {
  return [patternHeader("Post Header", `${plan.meta.slug}/post-header`), renderGroupBlock([
    block("post-title", { level: 1 }),
    block("post-date", {}),
    block("post-featured-image", { aspectRatio: "16/9" }),
  ].join("\n"), "post-header")].join("\n");
}

export function renderCtaBandPattern(plan: ThemePlan): string {
  const cta = plan.homepage.find((section): section is Extract<ThemeSection, { kind: "cta-band" }> => section.kind === "cta-band");
  const section = cta ?? { heading: "Keep exploring", body: plan.meta.description, buttonLabel: "Read more", buttonUrl: "/" };
  const content = [
    renderHeadingBlock({ content: section.heading, level: 2, align: "center" }),
    renderParagraphBlock({ content: section.body, align: "center" }),
    renderButtonsBlock(section.buttonLabel, section.buttonUrl),
  ].join("\n");
  return [patternHeader("CTA Band", `${plan.meta.slug}/cta-band`), renderGroupBlock(content, "cta-band")].join("\n");
}
