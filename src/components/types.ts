import { ThemeFileMap } from "@/lib/compiler/file-map";
import { DesignSelectionReport } from "@/lib/design/critic";
import { ThemePlan } from "@/lib/theme-plan/types";
import { ValidationReport } from "@/lib/validation/validation-report";

export type GenerationResultPayload = {
  plan: ThemePlan;
  designSelection?: DesignSelectionReport;
  files: ThemeFileMap;
  validation: ValidationReport;
  zipBase64?: string;
};

export type FieldIssue = { path: string; message: string };

export type GenerationErrorPayload = {
  message: string;
  code?: string;
  userFixable?: boolean;
  validation?: ValidationReport;
  fieldIssues?: FieldIssue[];
  retryAfterMs?: number;
};
