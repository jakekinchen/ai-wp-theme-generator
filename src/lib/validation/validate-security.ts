import { ThemeFileMap } from "@/lib/compiler/file-map";
import { fail, pass, ValidationCheck } from "./validation-report";

const allowedThemeUriHost = "example.com";

function isWellFormedPatternHeader(content: string): boolean {
  if (!content.startsWith("<?php")) return false;
  const matches = content.match(/<\?php[\s\S]*?\?>/g) ?? [];
  if (matches.length !== 1) return false;
  const [header] = matches;
  return /\/\*\*[\s\S]*Title:[^\n]+[\s\S]*Slug:[^\n]+[\s\S]*Categories:[^\n]+[\s\S]*\*\//.test(header);
}

export function validateSecurity(files: ThemeFileMap): ValidationCheck[] {
  const phpFiles = files.filter((file) => file.path.endsWith(".php"));
  const allText = files.map((file) => file.content).join("\n");

  const scriptLike = /<script\b/i.test(allText) || /<iframe\b/i.test(allText);
  const styleLike = /<style\b/i.test(allText) || /<link\b[^>]+href=["']https?:/i.test(allText);
  const remoteUrl = new RegExp(`https?://(?!${allowedThemeUriHost.replace(".", "\\.")})`, "i");
  const remote = remoteUrl.test(allText);
  const phpBlocksOutsideHeader = phpFiles.some((file) => !isWellFormedPatternHeader(file.content));
  const hasCustomHtml = /core\/html|wp:html/i.test(allText);
  const hasFreeform = /core\/freeform|wp:freeform/i.test(allText);

  return [
    hasCustomHtml ? fail("no-core-html-block", "No Custom HTML block") : pass("no-core-html-block", "No Custom HTML block"),
    hasFreeform ? fail("no-classic-freeform-block", "No Classic/freeform block") : pass("no-classic-freeform-block", "No Classic/freeform block"),
    scriptLike ? fail("no-remote-scripts", "No scripts or iframes") : pass("no-remote-scripts", "No scripts or iframes"),
    styleLike ? fail("no-remote-styles", "No style tags or remote styles") : pass("no-remote-styles", "No style tags or remote styles"),
    remote ? fail("no-remote-assets", "No remote assets") : pass("no-remote-assets", "No remote assets"),
    phpBlocksOutsideHeader ? fail("no-generated-executable-php", "Pattern PHP files contain only a well-formed header docblock") : pass("no-generated-executable-php", "Pattern PHP files contain only a well-formed header docblock"),
  ];
}
