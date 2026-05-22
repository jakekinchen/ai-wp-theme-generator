import { z } from "zod";
import { ThemePlanSchema } from "@/lib/theme-plan/schema";

type JsonSchema = Record<string, unknown>;

const annotationKeysToDrop = new Set(["$schema", "default"]);

function transformProperties(properties: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(properties).map(([key, value]) => [key, transform(value)]));
}

function transform(node: unknown): unknown {
  if (Array.isArray(node)) return node.map(transform);
  if (!node || typeof node !== "object") return node;
  const entries: [string, unknown][] = [];
  for (const [key, value] of Object.entries(node as Record<string, unknown>)) {
    if (annotationKeysToDrop.has(key)) continue;
    if (key === "oneOf") {
      entries.push(["anyOf", transform(value)]);
      continue;
    }
    if (key === "properties" && value && typeof value === "object") {
      entries.push([key, transformProperties(value as Record<string, unknown>)]);
      continue;
    }
    entries.push([key, transform(value)]);
  }
  const result = Object.fromEntries(entries) as JsonSchema;
  if (result.type === "object" && result.properties && typeof result.properties === "object") {
    result.additionalProperties = false;
    const propertyKeys = Object.keys(result.properties as Record<string, unknown>);
    const existingRequired = Array.isArray(result.required) ? (result.required as string[]) : [];
    const required = Array.from(new Set([...existingRequired, ...propertyKeys]));
    if (required.length > 0) result.required = required;
  }
  return result;
}

export const openAiThemePlanSchema = transform(z.toJSONSchema(ThemePlanSchema, { target: "draft-7" })) as JsonSchema;
