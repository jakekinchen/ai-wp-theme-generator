import { attrs, escapeHtml } from "../serialize-block";

export function renderHeadingBlock(input: {
  content: string;
  level: 1 | 2 | 3 | 4;
  align?: "left" | "center" | "right";
  className?: string;
}): string {
  const align = input.align ?? "left";
  return [
    `<!-- wp:heading ${attrs({ level: input.level, textAlign: align, className: input.className })} -->`,
    `<h${input.level} class="wp-block-heading has-text-align-${align}">${escapeHtml(input.content)}</h${input.level}>`,
    `<!-- /wp:heading -->`,
  ].join("\n");
}
