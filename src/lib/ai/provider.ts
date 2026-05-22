import { MockThemePlannerProvider } from "./mock-provider";
import { OpenAIThemePlannerProvider } from "./openai-provider";
import { ThemePlannerProvider } from "./types";

export function getThemePlannerProvider(): ThemePlannerProvider {
  if (process.env.OPENAI_API_KEY) {
    return new OpenAIThemePlannerProvider();
  }
  return new MockThemePlannerProvider();
}
