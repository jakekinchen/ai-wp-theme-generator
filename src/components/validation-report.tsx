import { ValidationReport as ValidationReportType } from "@/lib/validation/validation-report";

const glyph: Record<string, string> = {
  passed: "✓",
  failed: "✗",
  warning: "!",
};

export function ValidationReport({ validation }: { validation: ValidationReportType }) {
  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
        <span className={`audit-status audit-status--${validation.status === "passed" ? "passed" : "failed"}`}>
          <span aria-hidden>{glyph[validation.status]}</span>
          {validation.status === "passed" ? "Cleared for press" : "Press halted"}
        </span>
        <span className="label">{summarize(validation)}</span>
      </div>
      <div className="audit" role="list">
        {validation.checks.map((check) => (
          <div key={check.id} role="listitem" className={`audit__row audit__row--${check.status}`}>
            <span className="audit__glyph" aria-hidden>{glyph[check.status]}</span>
            <span className="audit__label">{check.label}</span>
            {check.message ? <span className="audit__note">{check.message}</span> : <span />}
          </div>
        ))}
      </div>
    </div>
  );
}

function summarize(validation: ValidationReportType): string {
  const counts: Record<string, number> = { passed: 0, failed: 0, warning: 0 };
  for (const check of validation.checks) counts[check.status] = (counts[check.status] ?? 0) + 1;
  const parts = [];
  if (counts.passed) parts.push(`${counts.passed} cleared`);
  if (counts.warning) parts.push(`${counts.warning} warn`);
  if (counts.failed) parts.push(`${counts.failed} halt`);
  return parts.join(" · ");
}
