import { ThemePlan } from "./types";

export const defaultTemplates: ThemePlan["templates"] = {
  home: ["header", "hero", "split-intro", "featured-query", "cta-band", "footer"],
  index: ["header", "hero", "featured-query", "footer"],
  single: ["header", "post-header", "post-content", "footer"],
  page: ["header", "post-header", "post-content", "footer"],
  archive: ["header", "archive-query", "footer"],
  search: ["header", "archive-query", "footer"],
  notFound: ["header", "404", "footer"],
};

export const directionDefaults = {
  "editorial-noir": {
    palette: {
      background: "#0e0e0f",
      foreground: "#f4f1ea",
      primary: "#d8a657",
      secondary: "#222226",
      muted: "#a8a29a",
      accent: "#f0c987",
    },
    typography: { headingFont: "serif", bodyFont: "sans", scale: "dramatic" },
    layout: { contentWidth: 760, wideWidth: 1280, spacing: "spacious", radius: "subtle" },
  },
  "soft-studio": {
    palette: {
      background: "#f7f3ee",
      foreground: "#1f2421",
      primary: "#3f6f5f",
      secondary: "#e4ddd4",
      muted: "#6d746c",
      accent: "#bd6b4f",
    },
    typography: { headingFont: "sans", bodyFont: "serif", scale: "balanced" },
    layout: { contentWidth: 760, wideWidth: 1180, spacing: "balanced", radius: "rounded" },
  },
  "brutalist-index": {
    palette: {
      background: "#f6f600",
      foreground: "#111111",
      primary: "#111111",
      secondary: "#ffffff",
      muted: "#5f5f00",
      accent: "#ff3b30",
    },
    typography: { headingFont: "mono", bodyFont: "sans", scale: "compact" },
    layout: { contentWidth: 720, wideWidth: 1100, spacing: "tight", radius: "none" },
  },
  "luxury-portfolio": {
    palette: {
      background: "#f5f0e8",
      foreground: "#171412",
      primary: "#8d6f3f",
      secondary: "#e6ddd0",
      muted: "#746b60",
      accent: "#2d3d34",
    },
    typography: { headingFont: "serif", bodyFont: "sans", scale: "dramatic" },
    layout: { contentWidth: 820, wideWidth: 1360, spacing: "spacious", radius: "subtle" },
  },
  "magazine-archive": {
    palette: {
      background: "#ffffff",
      foreground: "#151515",
      primary: "#be123c",
      secondary: "#f0f0f0",
      muted: "#666666",
      accent: "#164e63",
    },
    typography: { headingFont: "serif", bodyFont: "sans", scale: "balanced" },
    layout: { contentWidth: 760, wideWidth: 1400, spacing: "tight", radius: "none" },
  },
  "minimalist-agency": {
    palette: {
      background: "#fbfbf8",
      foreground: "#121212",
      primary: "#2563eb",
      secondary: "#eceff3",
      muted: "#62656b",
      accent: "#16a34a",
    },
    typography: { headingFont: "sans", bodyFont: "sans", scale: "balanced" },
    layout: { contentWidth: 780, wideWidth: 1240, spacing: "balanced", radius: "subtle" },
  },
  "warm-newsletter": {
    palette: {
      background: "#fff8ec",
      foreground: "#211812",
      primary: "#9a3412",
      secondary: "#f4dec3",
      muted: "#7c6b5c",
      accent: "#0f766e",
    },
    typography: { headingFont: "serif", bodyFont: "sans", scale: "balanced" },
    layout: { contentWidth: 700, wideWidth: 1120, spacing: "balanced", radius: "pill" },
  },
} as const;
