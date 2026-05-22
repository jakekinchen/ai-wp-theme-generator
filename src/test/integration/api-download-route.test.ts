import JSZip from "jszip";
import { describe, expect, it } from "vitest";
import { POST as download } from "@/app/api/download/route";
import { compileTheme } from "@/lib/compiler/compile-theme";
import { buildFixtureThemePlan } from "@/lib/theme-plan/fixtures";

function jsonRequest(body: unknown) {
  return new Request("http://localhost/api/download", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/download", () => {
  it("streams a zip for a validated file map", async () => {
    const files = compileTheme(buildFixtureThemePlan());
    const response = await download(jsonRequest({ files }));
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("application/zip");
    const zip = await JSZip.loadAsync(await response.arrayBuffer());
    expect(zip.file("obsidian-lens/style.css")).toBeTruthy();
  });

  it("rejects a file map containing unsafe paths", async () => {
    const files = compileTheme(buildFixtureThemePlan());
    const response = await download(jsonRequest({ files: [...files, { path: "../evil.php", content: "" }] }));
    expect(response.status).toBe(400);
    const payload = await response.json();
    expect(payload.validation?.status).toBe("failed");
  });
});
