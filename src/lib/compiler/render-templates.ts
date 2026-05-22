import { ThemePlan } from "@/lib/theme-plan/types";
import { block } from "./serialize-block";
import { renderPattern, renderTemplatePart } from "./renderers/template-part";

function frame(plan: ThemePlan, inner: string): string {
  return [renderTemplatePart("header", plan.meta.slug, "header"), inner, renderTemplatePart("footer", plan.meta.slug, "footer")].join("\n");
}

export function renderTemplates(plan: ThemePlan): Record<string, string> {
  const hero = renderPattern(`${plan.meta.slug}/hero`);
  const featuredQuery = renderPattern(`${plan.meta.slug}/featured-query`);
  const archiveQuery = renderPattern(`${plan.meta.slug}/archive-query`);
  const postHeader = renderPattern(`${plan.meta.slug}/post-header`);
  return {
    "templates/index.html": frame(plan, [hero, featuredQuery].join("\n")),
    "templates/home.html": frame(plan, [hero, renderPattern(`${plan.meta.slug}/split-intro`), featuredQuery, renderPattern(`${plan.meta.slug}/cta-band`)].join("\n")),
    "templates/single.html": frame(plan, [postHeader, block("post-content", { layout: { type: "constrained" } })].join("\n")),
    "templates/page.html": frame(plan, [postHeader, block("post-content", { layout: { type: "constrained" } })].join("\n")),
    "templates/archive.html": frame(plan, archiveQuery),
    "templates/search.html": frame(plan, archiveQuery),
    "templates/404.html": frame(plan, [block("heading", { level: 1 }, `<h1 class="wp-block-heading">Page not found</h1>`), block("paragraph", {}, "<p>Try searching or returning to the homepage.</p>")].join("\n")),
  };
}
