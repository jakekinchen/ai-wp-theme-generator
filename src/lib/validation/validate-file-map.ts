import { parse } from "@wordpress/block-serialization-default-parser";
import { ThemeFileMap } from "@/lib/compiler/file-map";
import { validateBlockMarkup } from "./validate-block-markup";
import { validateSecurity } from "./validate-security";
import { validateThemeJson } from "./validate-theme-json";
import { fail, pass, report, ValidationReport, ValidationCheck } from "./validation-report";

type ParsedBlockLike = {
  blockName: string | null;
  attrs?: Record<string, unknown>;
  innerBlocks?: ParsedBlockLike[];
};

const requiredRelativeFiles = [
  "style.css",
  "theme.json",
  "templates/index.html",
  "templates/home.html",
  "templates/single.html",
  "templates/page.html",
  "templates/archive.html",
  "templates/search.html",
  "templates/404.html",
  "parts/header.html",
  "parts/footer.html",
  "patterns/hero.php",
  "patterns/split-intro.php",
  "patterns/featured-query.php",
  "patterns/archive-query.php",
  "patterns/post-header.php",
  "patterns/cta-band.php",
];

const requiredParts = new Set(["header", "footer"]);
const patternHeaderRegex = /Slug:\s*([a-z0-9-]+\/[a-z0-9-]+)/g;
const styleCssHeaderFields = ["Theme Name:", "Version:", "Text Domain:"];

function stripPatternHeader(content: string): string {
  return content.replace(/^\s*<\?php[\s\S]*?\?>\s*/, "");
}

function walk(blocks: ParsedBlockLike[], visit: (block: ParsedBlockLike) => void): void {
  for (const item of blocks) {
    visit(item);
    if (item.innerBlocks) walk(item.innerBlocks, visit);
  }
}

function collectReferences(files: ThemeFileMap): { patterns: string[]; parts: { slug: string; theme?: string }[] } {
  const patterns: string[] = [];
  const parts: { slug: string; theme?: string }[] = [];
  for (const file of files) {
    if (!/\.(html|php)$/.test(file.path)) continue;
    const parsed = parse(stripPatternHeader(file.content)) as ParsedBlockLike[];
    walk(parsed, (item) => {
      if (item.blockName === "core/pattern" && typeof item.attrs?.slug === "string") {
        patterns.push(item.attrs.slug as string);
      }
      if (item.blockName === "core/template-part" && typeof item.attrs?.slug === "string") {
        parts.push({ slug: item.attrs.slug as string, theme: typeof item.attrs.theme === "string" ? item.attrs.theme as string : undefined });
      }
    });
  }
  return { patterns, parts };
}

function collectPatternSlugs(files: ThemeFileMap): Set<string> {
  const slugs = new Set<string>();
  for (const file of files) {
    if (!file.path.endsWith(".php")) continue;
    for (const match of file.content.matchAll(patternHeaderRegex)) {
      slugs.add(match[1]);
    }
  }
  return slugs;
}

function collectPartSlugs(files: ThemeFileMap): Set<string> {
  return new Set(
    files
      .filter((file) => file.path.includes("/parts/") && file.path.endsWith(".html"))
      .map((file) => file.path.split("/parts/")[1].replace(/\.html$/, "")),
  );
}

export function validateFileMap(files: ThemeFileMap): ValidationReport {
  const checks: ValidationCheck[] = [];
  const roots = new Set(files.map((file) => file.path.split("/")[0]));
  const root = [...roots][0] ?? "";
  const paths = files.map((file) => file.path);
  const pathSet = new Set(paths);
  const duplicates = paths.filter((path, index) => paths.indexOf(path) !== index);
  const unsafePaths = paths.filter((path) => path.startsWith("/") || path.includes("..") || path.includes("\\") || !path.startsWith(`${root}/`));

  checks.push(roots.size === 1 && root.length > 0 ? pass("single-root-folder", "Single root folder") : fail("single-root-folder", "Single root folder"));
  checks.push(unsafePaths.length === 0 ? pass("safe-file-paths", "Safe file paths") : fail("safe-file-paths", "Safe file paths", unsafePaths.join(", ")));
  checks.push(duplicates.length === 0 ? pass("no-duplicate-paths", "No duplicate file paths") : fail("no-duplicate-paths", "No duplicate file paths", duplicates.join(", ")));

  for (const relative of requiredRelativeFiles) {
    checks.push(pathSet.has(`${root}/${relative}`) ? pass(`required-file:${relative}`, `${relative} exists`) : fail(`required-file:${relative}`, `${relative} exists`));
  }
  checks.push(pathSet.has(`${root}/templates/index.html`) ? pass("index-template-present", "Index template present") : fail("index-template-present", "Index template present"));

  const styleCss = files.find((file) => file.path === `${root}/style.css`);
  const missingHeaders = styleCss ? styleCssHeaderFields.filter((field) => !styleCss.content.includes(field)) : styleCssHeaderFields;
  checks.push(missingHeaders.length === 0 ? pass("valid-style-css-header", "style.css has Theme Name, Version, and Text Domain") : fail("valid-style-css-header", "style.css has Theme Name, Version, and Text Domain", `missing: ${missingHeaders.join(", ")}`));

  const themeJson = files.find((file) => file.path === `${root}/theme.json`);
  checks.push(themeJson ? pass("valid-theme-json", "theme.json exists") : fail("valid-theme-json", "theme.json exists"));
  if (themeJson) checks.push(...validateThemeJson(themeJson.content));

  const patternSlugs = collectPatternSlugs(files);
  const partSlugs = collectPartSlugs(files);
  const refs = collectReferences(files);
  const missingPatternRefs = refs.patterns.filter((slug) => !patternSlugs.has(slug));
  const missingPartRefs = refs.parts.filter((reference) => !partSlugs.has(reference.slug)).map((reference) => reference.slug);
  const requiredPartsPresent = [...requiredParts].every((slug) => partSlugs.has(slug));

  checks.push(missingPatternRefs.length === 0 ? pass("all-pattern-references-resolve", "Pattern references resolve") : fail("all-pattern-references-resolve", "Pattern references resolve", missingPatternRefs.join(", ")));
  checks.push(missingPartRefs.length === 0 ? pass("all-template-part-references-resolve", "Template-part references resolve") : fail("all-template-part-references-resolve", "Template-part references resolve", missingPartRefs.join(", ")));
  checks.push(requiredPartsPresent ? pass("required-parts-present", "Required header and footer parts present") : fail("required-parts-present", "Required header and footer parts present"));

  for (const file of files.filter((item) => /\.(html|php)$/.test(item.path))) {
    checks.push(...validateBlockMarkup(file.path, file.content));
  }

  checks.push(...validateSecurity(files));
  return report(checks);
}
