import { describe, expect, it } from "vitest";
import { validateBlockMarkup } from "@/lib/validation/validate-block-markup";

describe("validateBlockMarkup", () => {
  it("catches Custom HTML, freeform, and unknown blocks", () => {
    expect(validateBlockMarkup("template.html", "<!-- wp:html --><div>x</div><!-- /wp:html -->").some((check) => check.status === "failed")).toBe(true);
    expect(validateBlockMarkup("template.html", "<!-- wp:freeform --><p>x</p><!-- /wp:freeform -->").some((check) => check.status === "failed")).toBe(true);
    expect(validateBlockMarkup("template.html", "<!-- wp:fake/block /-->").some((check) => check.status === "failed")).toBe(true);
  });
});
