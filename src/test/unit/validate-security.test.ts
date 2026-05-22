import { describe, expect, it } from "vitest";
import { validateSecurity } from "@/lib/validation/validate-security";

describe("validateSecurity", () => {
  it("rejects scripts, remote styles, iframes, custom HTML markers, and executable PHP", () => {
    const checks = validateSecurity([
      { path: "x/templates/index.html", content: "<script>alert(1)</script><!-- wp:html /--><iframe></iframe><link href=\"https://bad.test/x.css\">" },
      { path: "x/patterns/hero.php", content: "<?php echo 'bad'; ?>" },
    ]);
    expect(checks.filter((check) => check.status === "failed").length).toBeGreaterThanOrEqual(4);
  });
});
