import { parse } from "@wordpress/block-serialization-default-parser";
import { allowedBlockNameSet } from "@/lib/compiler/blocks";
import { fail, pass, ValidationCheck } from "./validation-report";

type ParsedBlockLike = {
  blockName: string | null;
  innerHTML?: string;
  innerBlocks?: ParsedBlockLike[];
};

function stripPatternHeader(content: string): string {
  return content.replace(/^\s*<\?php[\s\S]*?\?>\s*/, "");
}

function walk(blocks: ParsedBlockLike[], visit: (block: ParsedBlockLike, parent: ParsedBlockLike | null) => void, parent: ParsedBlockLike | null = null): void {
  for (const item of blocks) {
    visit(item, parent);
    if (item.innerBlocks) walk(item.innerBlocks, visit, item);
  }
}

function collect(blocks: ParsedBlockLike[]) {
  const names: string[] = [];
  const rawTopLevel: string[] = [];
  const queriesWithoutTemplate: string[] = [];

  for (const top of blocks) {
    if (!top.blockName && (top.innerHTML ?? "").trim()) {
      rawTopLevel.push(top.innerHTML ?? "");
    }
  }

  walk(blocks, (item) => {
    if (item.blockName) names.push(item.blockName);
    if (item.blockName === "core/query") {
      const hasTemplate = (item.innerBlocks ?? []).some((child) => child.blockName === "core/post-template");
      if (!hasTemplate) queriesWithoutTemplate.push("core/query");
    }
  });

  return { names, rawTopLevel, queriesWithoutTemplate };
}

export function validateBlockMarkup(path: string, content: string): ValidationCheck[] {
  const body = stripPatternHeader(content);
  try {
    const blocks = parse(body) as ParsedBlockLike[];
    const { names, rawTopLevel, queriesWithoutTemplate } = collect(blocks);
    const unknown = names.filter((name) => !allowedBlockNameSet.has(name));
    return [
      pass(`block-markup-parseable:${path}`, `${path} block markup parses`),
      unknown.length === 0
        ? pass(`only-allowed-blocks:${path}`, `${path} uses only allowed blocks`)
        : fail(`only-allowed-blocks:${path}`, `${path} uses only allowed blocks`, unknown.join(", ")),
      rawTopLevel.length === 0
        ? pass(`no-top-level-raw-html:${path}`, `${path} has no top-level raw HTML`)
        : fail(`no-top-level-raw-html:${path}`, `${path} has no top-level raw HTML`),
      queriesWithoutTemplate.length === 0
        ? pass(`query-has-post-template:${path}`, `${path} core/query blocks include core/post-template`)
        : fail(`query-has-post-template:${path}`, `${path} core/query blocks include core/post-template`, `${queriesWithoutTemplate.length} query without post-template`),
    ];
  } catch (error) {
    return [fail(`block-markup-parseable:${path}`, `${path} block markup parses`, error instanceof Error ? error.message : "Parse failed")];
  }
}
