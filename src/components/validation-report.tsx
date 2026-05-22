import { ValidationReport as ValidationReportType } from "@/lib/validation/validation-report";

export function ValidationReport({ validation }: { validation: ValidationReportType }) {
  return (
    <section className="grid gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Validation report</h2>
        <span className={`rounded px-2 py-1 text-xs font-semibold ${validation.status === "passed" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>
          {validation.status}
        </span>
      </div>
      <div className="max-h-72 overflow-auto rounded border border-slate-200">
        {validation.checks.map((check) => (
          <div key={check.id} className="grid gap-1 border-b border-slate-100 px-3 py-2 text-sm last:border-b-0">
            <span className={check.status === "failed" ? "font-semibold text-red-700" : check.status === "warning" ? "font-semibold text-amber-700" : "font-medium text-slate-800"}>{check.label}</span>
            {check.message && <span className="text-xs text-slate-500">{check.message}</span>}
          </div>
        ))}
      </div>
    </section>
  );
}
