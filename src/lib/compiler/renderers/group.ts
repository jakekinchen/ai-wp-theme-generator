import { block } from "../serialize-block";

export function renderGroupBlock(inner: string, className?: string): string {
  return block("group", { className, layout: { type: "constrained" } }, `<div class="wp-block-group ${className ?? ""}">\n${inner}\n</div>`);
}
