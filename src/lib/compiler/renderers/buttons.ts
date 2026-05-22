import { block, escapeHtml } from "../serialize-block";

export function renderButtonsBlock(label: string, url: string, align: "left" | "center" | "right" = "center"): string {
  const button = block(
    "button",
    {},
    `<div class="wp-block-button"><a class="wp-block-button__link wp-element-button" href="${escapeHtml(url)}">${escapeHtml(label)}</a></div>`,
  );
  const justifyContent = align === "left" ? "left" : align === "right" ? "right" : "center";
  return block("buttons", { layout: { type: "flex", justifyContent } }, button);
}
