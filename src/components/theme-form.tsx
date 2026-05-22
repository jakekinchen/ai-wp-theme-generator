"use client";

import { FormEvent, useMemo, useState } from "react";
import { GenerationErrorPayload, GenerationResultPayload } from "./types";

const sampleDescription =
  "A dark mode blog theme for photographers with a large centered hero, sticky navigation, oversized image-led post cards, and warm editorial typography.";

const fieldLabel: Record<string, string> = {
  themeName: "Theme name",
  slug: "Theme slug",
  description: "Natural language description",
  siteType: "Site type",
  preferredPalette: "Palette preference",
  typographyPreference: "Typography preference",
};

export function ThemeForm({
  error,
  onResult,
}: {
  error?: GenerationErrorPayload;
  onResult: (result: GenerationResultPayload | null, error?: GenerationErrorPayload) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    themeName: "Obsidian Lens",
    slug: "obsidian-lens",
    description: sampleDescription,
    siteType: "blog",
    preferredPalette: "dark editorial with warm amber accents",
    typographyPreference: "large serif headings with readable sans body",
    stickyNavigation: true,
    includeQueryLoop: true,
  });

  const fieldIssues = useMemo(() => {
    const issues = new Map<string, string>();
    for (const issue of error?.fieldIssues ?? []) {
      const head = issue.path.split(".")[0];
      if (head && !issues.has(head)) issues.set(head, issue.message);
    }
    return issues;
  }, [error]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    onResult(null);
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(form),
    });
    const payload = await response.json();
    setLoading(false);
    if (!response.ok) {
      onResult(null, payload.error ?? { message: "Generation failed." });
      return;
    }
    onResult(payload);
  }

  const fieldError = (key: string) => fieldIssues.get(key);

  return (
    <form onSubmit={submit} className="grid gap-4" aria-busy={loading}>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field name="themeName" label="Theme name" error={fieldError("themeName")}>
          <input className="rounded border border-slate-300 px-3 py-2" value={form.themeName} onChange={(event) => setForm({ ...form, themeName: event.target.value })} />
        </Field>
        <Field name="slug" label="Theme slug" error={fieldError("slug")}>
          <input className="rounded border border-slate-300 px-3 py-2 font-mono" value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} />
        </Field>
      </div>
      <Field name="description" label="Natural language description" error={fieldError("description")}>
        <textarea className="min-h-32 rounded border border-slate-300 px-3 py-2" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
      </Field>
      <div className="grid gap-3 sm:grid-cols-3">
        <Field name="siteType" label="Site type" error={fieldError("siteType")}>
          <select className="rounded border border-slate-300 px-3 py-2" value={form.siteType} onChange={(event) => setForm({ ...form, siteType: event.target.value })}>
            {["blog", "portfolio", "agency", "magazine", "newsletter"].map((type) => <option key={type}>{type}</option>)}
          </select>
        </Field>
        <Field name="preferredPalette" label="Palette preference" wide error={fieldError("preferredPalette")}>
          <input className="rounded border border-slate-300 px-3 py-2" value={form.preferredPalette} onChange={(event) => setForm({ ...form, preferredPalette: event.target.value })} />
        </Field>
      </div>
      <Field name="typographyPreference" label="Typography preference" error={fieldError("typographyPreference")}>
        <input className="rounded border border-slate-300 px-3 py-2" value={form.typographyPreference} onChange={(event) => setForm({ ...form, typographyPreference: event.target.value })} />
      </Field>
      <div className="flex flex-wrap gap-4 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={form.stickyNavigation} onChange={(event) => setForm({ ...form, stickyNavigation: event.target.checked })} />
          Sticky navigation
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={form.includeQueryLoop} onChange={(event) => setForm({ ...form, includeQueryLoop: event.target.checked })} />
          Include query loop
        </label>
      </div>
      <button className="rounded bg-slate-950 px-4 py-3 text-sm font-semibold text-white disabled:bg-slate-400" disabled={loading}>
        {loading ? "Generating..." : "Generate theme"}
      </button>
      {error && (
        <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800" role="alert">
          <strong className="block">{error.message}</strong>
          {error.fieldIssues && error.fieldIssues.length > 0 && (
            <ul className="mt-2 list-disc pl-5">
              {error.fieldIssues.map((issue) => (
                <li key={`${issue.path}-${issue.message}`}>
                  <span className="font-semibold">{fieldLabel[issue.path] ?? issue.path}:</span> {issue.message}
                </li>
              ))}
            </ul>
          )}
          {error.retryAfterMs ? <p className="mt-2 text-xs">Retry in roughly {Math.ceil(error.retryAfterMs / 1000)}s.</p> : null}
        </div>
      )}
    </form>
  );
}

function Field({
  name,
  label,
  children,
  error,
  wide,
}: {
  name: string;
  label: string;
  children: React.ReactNode;
  error?: string;
  wide?: boolean;
}) {
  return (
    <label className={`grid gap-1 text-sm font-medium ${wide ? "sm:col-span-2" : ""}`} data-field={name}>
      {label}
      {children}
      {error && <span className="text-xs font-normal text-red-700">{error}</span>}
    </label>
  );
}
