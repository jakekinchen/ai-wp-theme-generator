import { ValidationReport } from "@/lib/validation/validation-report";

export type FieldIssue = { path: string; message: string };

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public userFixable = false,
    public validation?: ValidationReport,
    public fieldIssues?: FieldIssue[],
    public retryAfterMs?: number,
  ) {
    super(message);
  }
}

export class InputValidationError extends AppError {
  constructor(message: string, fieldIssues?: FieldIssue[]) {
    super(message, "INPUT_VALIDATION", true, undefined, fieldIssues);
  }
}

export class AiGenerationError extends AppError {
  constructor(message: string) {
    super(message, "AI_GENERATION", false);
  }
}

export class ThemePlanValidationError extends AppError {
  constructor(message: string, validation?: ValidationReport) {
    super(message, "THEME_PLAN_VALIDATION", false, validation);
  }
}

export class ThemeCompilationError extends AppError {
  constructor(message: string) {
    super(message, "THEME_COMPILATION", false);
  }
}

export class ThemeOutputValidationError extends AppError {
  constructor(message: string, validation?: ValidationReport) {
    super(message, "THEME_OUTPUT_VALIDATION", false, validation);
  }
}

export class PackagingError extends AppError {
  constructor(message: string, validation?: ValidationReport) {
    super(message, "PACKAGING", false, validation);
  }
}

export class RateLimitError extends AppError {
  constructor(message: string, retryAfterMs: number) {
    super(message, "RATE_LIMITED", true, undefined, undefined, retryAfterMs);
  }
}

export class PayloadTooLargeError extends AppError {
  constructor(message: string) {
    super(message, "PAYLOAD_TOO_LARGE", true);
  }
}

export function publicError(error: unknown) {
  if (error instanceof AppError) {
    return {
      error: {
        code: error.code,
        message: error.message,
        userFixable: error.userFixable,
        validation: error.validation,
        fieldIssues: error.fieldIssues,
        retryAfterMs: error.retryAfterMs,
      },
    };
  }
  return {
    error: {
      code: "UNKNOWN",
      message: "An unexpected error occurred while generating the theme.",
      userFixable: false,
    },
  };
}
