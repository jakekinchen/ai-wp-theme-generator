import { AllowedBlockName } from "./blocks";

type AttrValue = string | number | boolean | null | undefined | Record<string, unknown>;

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function attrs(input: Record<string, AttrValue>): string {
  const cleaned = Object.fromEntries(
    Object.entries(input).filter(([, value]) => value !== undefined && value !== null),
  );
  return Object.keys(cleaned).length ? JSON.stringify(cleaned) : "";
}

export function block(name: AllowedBlockName extends `core/${infer ShortName}` ? ShortName : never, attributes: Record<string, AttrValue>, inner = ""): string {
  const attrText = attrs(attributes);
  const open = attrText ? `<!-- wp:${name} ${attrText} -->` : `<!-- wp:${name} -->`;
  if (!inner) {
    return attrText ? `<!-- wp:${name} ${attrText} /-->` : `<!-- wp:${name} /-->`;
  }
  return [open, inner, `<!-- /wp:${name} -->`].join("\n");
}
