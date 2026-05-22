import { ThemePlan } from "@/lib/theme-plan/types";
import { fontStack, radiusValue } from "./design-tokens";

export function renderThemeJson(plan: ThemePlan): string {
  return JSON.stringify(
    {
      version: 3,
      settings: {
        appearanceTools: true,
        layout: {
          contentSize: `${plan.design.layout.contentWidth}px`,
          wideSize: `${plan.design.layout.wideWidth}px`,
        },
        color: {
          palette: Object.entries(plan.design.palette).map(([slug, color]) => ({
            slug,
            color,
            name: slug.replace(/^\w/, (letter) => letter.toUpperCase()),
          })),
        },
        typography: {
          fontFamilies: [
            { fontFamily: fontStack(plan.design.typography.headingFont), slug: "heading", name: "Heading" },
            { fontFamily: fontStack(plan.design.typography.bodyFont), slug: "body", name: "Body" },
          ],
        },
        spacing: { spacingScale: { steps: 7 } },
        border: { radius: true },
      },
      styles: {
        color: {
          background: "var:preset|color|background",
          text: "var:preset|color|foreground",
        },
        typography: {
          fontFamily: "var:preset|font-family|body",
        },
        elements: {
          heading: {
            typography: {
              fontFamily: "var:preset|font-family|heading",
            },
          },
          button: {
            border: { radius: radiusValue(plan.design.layout.radius) },
            color: {
              background: "var:preset|color|primary",
              text: "var:preset|color|background",
            },
          },
        },
      },
    },
    null,
    2,
  );
}
