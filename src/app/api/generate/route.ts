import { ZodError } from "zod";
import { getThemePlannerProvider } from "@/lib/ai/provider";
import { compileTheme } from "@/lib/compiler/compile-theme";
import { packageTheme } from "@/lib/packaging/package-theme";
import { ThemeInput } from "@/lib/theme-plan/input-schema";
import { normalizeThemeInput } from "@/lib/theme-plan/normalize-input";
import {
  AppError,
  InputValidationError,
  PayloadTooLargeError,
  publicError,
  RateLimitError,
  ThemeOutputValidationError,
  ThemePlanValidationError,
} from "@/lib/utils/errors";
import { checkRateLimit } from "@/lib/utils/rate-limit";
import { validateFileMap } from "@/lib/validation/validate-file-map";
import { validateThemePlan } from "@/lib/validation/validate-theme-plan";

const MAX_BODY_BYTES = 16 * 1024;
const RATE_LIMIT = { windowMs: 60_000, maxRequests: 10 };

function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "anonymous";
}

async function readBoundedJson(request: Request): Promise<unknown> {
  const declaredLength = Number(request.headers.get("content-length") ?? "");
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
    throw new PayloadTooLargeError(`Request body exceeds ${MAX_BODY_BYTES} byte cap.`);
  }
  const text = await request.text();
  if (text.length > MAX_BODY_BYTES) {
    throw new PayloadTooLargeError(`Request body exceeds ${MAX_BODY_BYTES} byte cap.`);
  }
  try {
    return JSON.parse(text);
  } catch {
    throw new InputValidationError("Request body is not valid JSON.");
  }
}

function asInputValidation(error: unknown): InputValidationError | null {
  if (error instanceof InputValidationError) return error;
  if (error instanceof ZodError) {
    const fieldIssues = error.issues.map((issue) => ({
      path: issue.path.map((segment) => String(segment)).join(".") || "(root)",
      message: issue.message,
    }));
    return new InputValidationError("Theme input failed validation.", fieldIssues);
  }
  if (error instanceof Error && /unsupported WordPress block|PHP-like/i.test(error.message)) {
    return new InputValidationError(error.message);
  }
  return null;
}

function statusFor(error: unknown): number {
  if (error instanceof InputValidationError || error instanceof PayloadTooLargeError) return 400;
  if (error instanceof RateLimitError) return 429;
  if (error instanceof AppError) return 422;
  return 500;
}

export async function POST(request: Request) {
  try {
    const limit = checkRateLimit(clientKey(request), RATE_LIMIT);
    if (!limit.allowed) {
      throw new RateLimitError("Too many generation requests. Try again shortly.", limit.retryAfterMs);
    }
    const raw = (await readBoundedJson(request)) as ThemeInput;
    const input = normalizeThemeInput(raw);
    const plan = await getThemePlannerProvider().generateThemePlan(input);
    const planValidation = validateThemePlan(plan);
    if (planValidation.status === "failed") {
      throw new ThemePlanValidationError("Generated ThemePlan failed validation.", planValidation);
    }
    const files = compileTheme(plan);
    const validation = validateFileMap(files);
    if (validation.status === "failed") {
      throw new ThemeOutputValidationError("Generated theme files failed validation.", validation);
    }
    const zip = await packageTheme(files);
    return Response.json({
      plan,
      files,
      validation,
      zipBase64: zip.toString("base64"),
    });
  } catch (error) {
    const inputError = asInputValidation(error);
    const normalized = inputError ?? error;
    const status = statusFor(normalized);
    if (status >= 500) console.error(error);
    return Response.json(publicError(normalized), { status });
  }
}
