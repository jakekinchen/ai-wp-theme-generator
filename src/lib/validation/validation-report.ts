export type ValidationCheck = {
  id: string;
  label: string;
  status: "passed" | "failed" | "warning";
  message?: string;
};

export type ValidationReport = {
  status: "passed" | "failed";
  checks: ValidationCheck[];
};

export function report(checks: ValidationCheck[]): ValidationReport {
  return {
    status: checks.some((check) => check.status === "failed") ? "failed" : "passed",
    checks,
  };
}

export function pass(id: string, label: string, message?: string): ValidationCheck {
  return { id, label, status: "passed", message };
}

export function fail(id: string, label: string, message?: string): ValidationCheck {
  return { id, label, status: "failed", message };
}

export function warn(id: string, label: string, message?: string): ValidationCheck {
  return { id, label, status: "warning", message };
}
