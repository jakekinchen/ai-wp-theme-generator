import { ThemePlan } from "@/lib/theme-plan/types";
import { ThemeFileMap } from "./file-map";
import { renderParts } from "./render-parts";
import { renderPatterns } from "./render-patterns";
import { renderStyleCss } from "./render-style-css";
import { renderTemplates } from "./render-templates";
import { renderThemeJson } from "./theme-json";

export function compileTheme(plan: ThemePlan): ThemeFileMap {
  const root = plan.meta.slug;
  const files: Record<string, string> = {
    "style.css": renderStyleCss(plan),
    "theme.json": renderThemeJson(plan),
    ...renderTemplates(plan),
    ...renderParts(plan),
    ...renderPatterns(plan),
  };

  return Object.entries(files).map(([path, content]) => ({
    path: `${root}/${path}`,
    content,
  }));
}
