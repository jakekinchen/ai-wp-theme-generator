import JSZip from "jszip";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { POST as generate } from "@/app/api/generate/route";
import { resetRateLimit } from "@/lib/utils/rate-limit";

function jsonRequest(body: unknown, headers: Record<string, string> = {}) {
  const serialized = JSON.stringify(body);
  return new Request("http://localhost/api/generate", {
    method: "POST",
    headers: { "content-type": "application/json", "content-length": String(serialized.length), ...headers },
    body: serialized,
  });
}

const validInput = {
  themeName: "Plain Signal",
  slug: "plain-signal",
  description: "A minimalist agency site for strategy work with clear archive cards.",
  siteType: "agency",
  stickyNavigation: false,
};

describe("POST /api/generate", () => {
  beforeEach(() => {
    delete process.env.OPENAI_API_KEY;
    resetRateLimit();
  });
  afterEach(() => resetRateLimit());

  it("returns a packaged theme for valid input", async () => {
    const response = await generate(jsonRequest(validInput, { "x-forwarded-for": "10.0.0.1" }));
    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(payload.validation.status).toBe("passed");
    expect(payload.plan.meta.slug).toBe("plain-signal");
    expect(payload.files.some((file: { path: string }) => file.path.endsWith("templates/index.html"))).toBe(true);
    const zip = await JSZip.loadAsync(Buffer.from(payload.zipBase64, "base64"));
    expect(zip.file("plain-signal/style.css")).toBeTruthy();
  });

  it("returns field-level issues for invalid input", async () => {
    const response = await generate(jsonRequest({ ...validInput, slug: "Bad Slug", description: "tiny" }, { "x-forwarded-for": "10.0.0.2" }));
    expect(response.status).toBe(400);
    const payload = await response.json();
    expect(payload.error.code).toBe("INPUT_VALIDATION");
    const paths = (payload.error.fieldIssues ?? []).map((issue: { path: string }) => issue.path);
    expect(paths).toContain("slug");
    expect(paths).toContain("description");
  });

  it("rejects oversize bodies before any AI work", async () => {
    const huge = "x".repeat(20 * 1024);
    const response = await generate(jsonRequest({ ...validInput, description: huge }, { "x-forwarded-for": "10.0.0.3" }));
    expect(response.status).toBe(400);
    const payload = await response.json();
    expect(payload.error.code).toBe("PAYLOAD_TOO_LARGE");
  });

  it("rejects PHP-like injection in the description", async () => {
    const response = await generate(jsonRequest({ ...validInput, description: `${validInput.description} <!-- wp:html -->` }, { "x-forwarded-for": "10.0.0.4" }));
    expect(response.status).toBe(400);
    const payload = await response.json();
    expect(payload.error.code).toBe("INPUT_VALIDATION");
  });

  it("rate-limits a hammering client", async () => {
    const ip = "10.0.0.5";
    for (let i = 0; i < 10; i += 1) {
      const response = await generate(jsonRequest(validInput, { "x-forwarded-for": ip }));
      expect(response.status).toBe(200);
    }
    const blocked = await generate(jsonRequest(validInput, { "x-forwarded-for": ip }));
    expect(blocked.status).toBe(429);
    const payload = await blocked.json();
    expect(payload.error.code).toBe("RATE_LIMITED");
  });
});
