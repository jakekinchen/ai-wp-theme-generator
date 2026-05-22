import { z } from "zod";
import { ThemePlanSchema, ThemeSectionSchema } from "./schema";

export type ThemePlan = z.infer<typeof ThemePlanSchema>;
export type ThemeSection = z.infer<typeof ThemeSectionSchema>;
