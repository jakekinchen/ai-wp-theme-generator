import { NormalizedThemeInput } from "@/lib/theme-plan/input-schema";
import { DesignDirectionSchema } from "@/lib/theme-plan/schema";

const sectionTypes = ["hero", "split-intro", "query-grid", "cta-band"];

export function buildThemePlanPrompt(input: NormalizedThemeInput, repair?: string): string {
  return [
    "Role: You are designing a WordPress block theme plan.",
    "Hard constraints:",
    "- Return only JSON data matching the ThemePlan schema.",
    "- Do not generate raw PHP.",
    "- Do not generate arbitrary HTML.",
    "- Do not use Custom HTML block, core/html, wp:html, Classic block, core/freeform, or wp:freeform.",
    "- Only choose from the supported section recipes.",
    "- The application will compile your ThemePlan into WordPress files.",
    "- You are not responsible for serializing WordPress block markup.",
    "- You must not invent block names, file paths, PHP, raw files, zips, or raw HTML.",
    "Design goal: Make the theme visually distinctive and non-generic while remaining accessible.",
    `Supported design directions: ${DesignDirectionSchema.options.join(", ")}.`,
    `Supported section types: ${sectionTypes.join(", ")}.`,
    `User input: ${JSON.stringify(input)}`,
    repair ? `Previous validation errors to correct: ${repair}` : "",
  ].filter(Boolean).join("\n");
}
