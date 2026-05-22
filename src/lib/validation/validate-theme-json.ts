import Ajv from "ajv";
import { fail, pass, ValidationCheck } from "./validation-report";

const ajv = new Ajv();
const themeJsonSchema = {
  type: "object",
  required: ["version", "settings", "styles"],
  properties: {
    version: { const: 3 },
    settings: {
      type: "object",
      required: ["layout", "color", "typography"],
      properties: {
        layout: {
          type: "object",
          required: ["contentSize", "wideSize"],
          properties: {
            contentSize: { type: "string", pattern: "^[0-9]+px$" },
            wideSize: { type: "string", pattern: "^[0-9]+px$" },
          },
        },
        color: { type: "object" },
        typography: { type: "object" },
      },
    },
    styles: { type: "object" },
  },
};

export function validateThemeJson(content: string): ValidationCheck[] {
  try {
    const parsed = JSON.parse(content);
    const valid = ajv.validate(themeJsonSchema, parsed);
    const stringified = JSON.stringify(parsed);
    return [
      valid ? pass("theme-json-schema-valid", "theme.json schema is valid") : fail("theme-json-schema-valid", "theme.json schema is valid", ajv.errorsText()),
      parsed.version === 3 ? pass("theme-json-version", "theme.json uses version 3") : fail("theme-json-version", "theme.json uses version 3"),
      /https?:\/\//i.test(stringified) ? fail("no-external-font-urls", "No external font URLs") : pass("no-external-font-urls", "No external font URLs"),
      /#[0-9a-fA-F]{6}/.test(stringified) ? pass("valid-hex-colors", "Theme colors use valid hex values") : fail("valid-hex-colors", "Theme colors use valid hex values"),
    ];
  } catch (error) {
    return [fail("valid-theme-json", "theme.json parses as JSON", error instanceof Error ? error.message : "Invalid JSON")];
  }
}
