import { describe, expect, it } from "vitest";
import { openAiThemePlanSchema } from "@/lib/ai/openai-schema";

type Schema = Record<string, unknown> & { type?: string; properties?: Record<string, Schema>; required?: string[]; additionalProperties?: boolean; anyOf?: Schema[]; oneOf?: Schema[]; items?: Schema };

function walk(schema: Schema, visit: (node: Schema) => void): void {
  visit(schema);
  if (schema.properties) for (const child of Object.values(schema.properties)) walk(child, visit);
  if (schema.items) walk(schema.items, visit);
  if (schema.anyOf) for (const child of schema.anyOf) walk(child, visit);
  if (schema.oneOf) for (const child of schema.oneOf) walk(child, visit);
}

describe("openAiThemePlanSchema", () => {
  it("matches OpenAI Responses strict-mode requirements", () => {
    const schema = openAiThemePlanSchema as Schema;
    expect(schema.type).toBe("object");

    walk(schema, (node) => {
      expect(node.oneOf, "uses anyOf, not oneOf").toBeUndefined();
      expect((node as Record<string, unknown>).$schema, "no $schema annotation").toBeUndefined();
      expect((node as Record<string, unknown>).default, "no defaults").toBeUndefined();
      if (node.type === "object" && node.properties) {
        expect(node.additionalProperties).toBe(false);
        const propertyKeys = Object.keys(node.properties).sort();
        const required = [...(node.required ?? [])].sort();
        expect(required).toEqual(propertyKeys);
      }
    });
  });

  it("preserves length constraints carried from Zod", () => {
    const schema = openAiThemePlanSchema as Schema;
    const description = schema.properties?.meta?.properties?.description as Record<string, unknown>;
    expect(description.minLength).toBe(10);
    expect(description.maxLength).toBe(240);
  });
});
