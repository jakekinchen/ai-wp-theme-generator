import { attrs, escapeHtml } from "../serialize-block";

export function renderParagraphBlock(input: {
  content: string;
  align?: "left" | "center" | "right";
  className?: string;
}): string {
  const align = input.align ?? "left";
  return [
    `<!-- wp:paragraph ${attrs({ align, className: input.className })} -->`,
    `<p class="has-text-align-${align}">${escapeHtml(input.content)}</p>`,
    `<!-- /wp:paragraph -->`,
  ].join("\n");
}
