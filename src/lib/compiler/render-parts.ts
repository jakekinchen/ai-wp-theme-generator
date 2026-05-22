import { ThemePlan } from "@/lib/theme-plan/types";
import { renderFooterPart, renderHeaderPart } from "./renderers/pattern";

export function renderParts(plan: ThemePlan): Record<string, string> {
  return {
    "parts/header.html": renderHeaderPart(plan),
    "parts/footer.html": renderFooterPart(plan),
  };
}
