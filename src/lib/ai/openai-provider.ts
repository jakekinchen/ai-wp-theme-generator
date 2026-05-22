import OpenAI from "openai";
import { NormalizedThemeInput } from "@/lib/theme-plan/input-schema";
import { ThemePlanSchema } from "@/lib/theme-plan/schema";
import { ThemePlan } from "@/lib/theme-plan/types";
import { AiGenerationError, ThemePlanValidationError } from "@/lib/utils/errors";
import { buildThemePlanPrompt } from "./prompt";
import { openAiThemePlanSchema } from "./openai-schema";
import { ThemePlannerProvider } from "./types";

function extractJson(response: unknown): unknown {
  const outputText = (response as { output_text?: string }).output_text;
  if (outputText) return JSON.parse(outputText);
  const text = JSON.stringify(response);
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("OpenAI response did not contain JSON.");
  return JSON.parse(match[0]);
}

function validationMessage(error: unknown): string {
  return error instanceof Error ? error.message : "ThemePlan validation failed.";
}

export class OpenAIThemePlannerProvider implements ThemePlannerProvider {
  constructor(private client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })) {}

  async generateThemePlan(input: NormalizedThemeInput): Promise<ThemePlan> {
    let repair: string | undefined;
    for (let attempt = 1; attempt <= 2; attempt += 1) {
      try {
        const response = await this.client.responses.create({
          model: process.env.OPENAI_MODEL ?? "gpt-4.1-mini",
          input: buildThemePlanPrompt(input, repair),
          text: {
            format: {
              type: "json_schema",
              name: "theme_plan",
              schema: openAiThemePlanSchema,
              strict: true,
            },
          },
        });
        const parsed = ThemePlanSchema.safeParse(extractJson(response));
        if (parsed.success) return parsed.data;
        repair = parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("; ");
      } catch (error) {
        const message = validationMessage(error);
        if (/rate.?limit|429/i.test(message)) throw new AiGenerationError("OpenAI rate limit reached. Try again later.");
        if (/api key|401|authentication/i.test(message)) throw new AiGenerationError("OpenAI authentication failed. Check OPENAI_API_KEY.");
        if (attempt === 2) throw new AiGenerationError(`OpenAI generation failed: ${message}`);
        repair = message;
      }
    }
    throw new ThemePlanValidationError(`The model returned an invalid ThemePlan after one repair attempt: ${repair}`);
  }
}
