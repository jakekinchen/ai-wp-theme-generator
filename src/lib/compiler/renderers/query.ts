import { block } from "../serialize-block";
import { renderHeadingBlock } from "./heading";
import { renderParagraphBlock } from "./paragraph";

export type QueryInput = {
  heading: string;
  columns: 2 | 3 | 4;
  showExcerpt: boolean;
  showDate: boolean;
  cardStyle: "bordered" | "image-led" | "minimal" | "magazine";
};

function bordered(input: QueryInput): string {
  const inner = [
    block("post-featured-image", { isLink: true, aspectRatio: "4/3" }),
    block("group", { className: "card-meta", layout: { type: "flex", flexWrap: "nowrap" } }, [
      input.showDate ? block("post-date", {}) : "",
    ].filter(Boolean).join("\n")),
    block("post-title", { isLink: true, level: 3 }),
    input.showExcerpt ? block("post-excerpt", { excerptLength: 20 }) : "",
  ].filter(Boolean).join("\n");
  return block(
    "post-template",
    { className: "card-bordered", layout: { type: "grid", columnCount: input.columns } },
    inner,
  );
}

function imageLed(input: QueryInput): string {
  const inner = [
    block("post-featured-image", { isLink: true, aspectRatio: "16/9", className: "card-image-led__image" }),
    block("post-title", { isLink: true, level: 2 }),
    input.showDate ? block("post-date", {}) : "",
    input.showExcerpt ? block("post-excerpt", { excerptLength: 28 }) : "",
  ].filter(Boolean).join("\n");
  return block(
    "post-template",
    { className: "card-image-led", layout: { type: "grid", columnCount: input.columns } },
    inner,
  );
}

function magazine(input: QueryInput): string {
  const meta = block(
    "group",
    { className: "card-magazine__meta", layout: { type: "flex" } },
    [input.showDate ? block("post-date", {}) : ""].filter(Boolean).join("\n"),
  );
  const inner = [
    block("post-featured-image", { isLink: true, aspectRatio: "3/2" }),
    meta,
    block("post-title", { isLink: true, level: 3 }),
    input.showExcerpt ? block("post-excerpt", { excerptLength: 16 }) : "",
  ].filter(Boolean).join("\n");
  return block(
    "post-template",
    { className: "card-magazine", layout: { type: "grid", columnCount: input.columns } },
    inner,
  );
}

function minimal(input: QueryInput): string {
  const inner = [
    block("post-title", { isLink: true, level: 3 }),
    input.showDate ? block("post-date", {}) : "",
  ].filter(Boolean).join("\n");
  return block(
    "post-template",
    { className: "card-minimal", layout: { type: "default" } },
    inner,
  );
}

function buildTemplate(input: QueryInput): string {
  if (input.cardStyle === "image-led") return imageLed(input);
  if (input.cardStyle === "magazine") return magazine(input);
  if (input.cardStyle === "minimal") return minimal(input);
  return bordered(input);
}

export function renderQueryBlock(input: QueryInput): string {
  const postTemplate = buildTemplate(input);
  const pagination = block(
    "query-pagination",
    { layout: { type: "flex", justifyContent: "space-between" } },
    [block("query-pagination-previous", {}), block("query-pagination-numbers", {}), block("query-pagination-next", {})].join("\n"),
  );
  const noResults = block("query-no-results", {}, renderParagraphBlock({ content: "No posts found." }));
  return [
    renderHeadingBlock({ content: input.heading, level: 2, align: input.cardStyle === "magazine" ? "left" : "center" }),
    block(
      "query",
      { query: { perPage: input.cardStyle === "magazine" ? 8 : 6, pages: 0, offset: 0, postType: "post", order: "desc", orderBy: "date" } },
      [postTemplate, pagination, noResults].join("\n"),
    ),
  ].join("\n");
}
