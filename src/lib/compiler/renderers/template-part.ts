import { block } from "../serialize-block";

export function renderTemplatePart(slug: "header" | "footer", theme: string, tagName: string): string {
  return block("template-part", { slug, theme, tagName });
}

export function renderPattern(slug: string): string {
  return block("pattern", { slug });
}
