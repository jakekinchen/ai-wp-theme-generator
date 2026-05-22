"use client";

import { FormEvent, useMemo, useState } from "react";
import { GenerationErrorPayload, GenerationResultPayload } from "./types";

const sampleDescription =
  "A dark mode blog theme for photographers with a large centered hero, sticky navigation, oversized image-led post cards, and warm editorial typography.";

const fieldLabel: Record<string, string> = {
  themeName: "Theme name",
  slug: "Theme slug",
  description: "Description",
  siteType: "Site type",
  preferredPalette: "Palette",
  typographyPreference: "Typography",
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
    <div className="brief">
      <div className="section-head">
        <div>
          <div className="section-head__id">§ 01</div>
          <h2 className="section-head__title">The brief.</h2>
        </div>
        <div className="section-head__meta">Spec sheet</div>
      </div>

      <p className="brief__intro">
        Submit a short description and a few preferences. The compiler will route your brief to a
        constrained design direction, lay out the homepage, render valid block markup, and
        package an installable theme.
      </p>

      <form onSubmit={submit} className="spec" aria-busy={loading}>
        <div className="spec__row spec__row--inline">
          <Field name="themeName" label="Theme name" hint="3 – 80" error={fieldError("themeName")}>
            <input
              className="spec__input"
              value={form.themeName}
              onChange={(event) => setForm({ ...form, themeName: event.target.value })}
            />
          </Field>
          <Field name="slug" label="Slug" hint="lower-kebab" error={fieldError("slug")}>
            <input
              className="spec__input spec__input--mono"
              value={form.slug}
              onChange={(event) => setForm({ ...form, slug: event.target.value })}
            />
          </Field>
        </div>

        <Field name="description" label="Description" hint="20 – 2 000 chars" error={fieldError("description")}>
          <textarea
            className="spec__textarea"
            value={form.description}
            onChange={(event) => setForm({ ...form, description: event.target.value })}
          />
        </Field>

        <div className="spec__row spec__row--inline">
          <Field name="siteType" label="Site type" hint="routes direction" error={fieldError("siteType")}>
            <select
              className="spec__select"
              value={form.siteType}
              onChange={(event) => setForm({ ...form, siteType: event.target.value })}
            >
              {["blog", "portfolio", "agency", "magazine", "newsletter"].map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </Field>
          <Field name="preferredPalette" label="Palette" hint="optional · max 120" error={fieldError("preferredPalette")}>
            <input
              className="spec__input"
              value={form.preferredPalette}
              onChange={(event) => setForm({ ...form, preferredPalette: event.target.value })}
            />
          </Field>
        </div>

        <Field name="typographyPreference" label="Typography" hint="optional · max 120" error={fieldError("typographyPreference")}>
          <input
            className="spec__input"
            value={form.typographyPreference}
            onChange={(event) => setForm({ ...form, typographyPreference: event.target.value })}
          />
        </Field>

        <div className="spec__toggles">
          <label className="spec__toggle">
            <input
              type="checkbox"
              checked={form.stickyNavigation}
              onChange={(event) => setForm({ ...form, stickyNavigation: event.target.checked })}
            />
            Sticky navigation
          </label>
          <label className="spec__toggle">
            <input
              type="checkbox"
              checked={form.includeQueryLoop}
              onChange={(event) => setForm({ ...form, includeQueryLoop: event.target.checked })}
            />
            Include query loop
          </label>
        </div>

        <button className="press" disabled={loading}>
          <span className="press__num">→</span>
          {loading ? "Setting type…" : "Set theme"}
        </button>

        {error && (
          <div className="notice" role="alert">
            <div className="notice__head">Press halted · {error.code ?? "ERROR"}</div>
            <div className="notice__body">{error.message}</div>
            {error.fieldIssues && error.fieldIssues.length > 0 && (
              <ul>
                {error.fieldIssues.map((issue) => (
                  <li key={`${issue.path}-${issue.message}`}>
                    <strong>{fieldLabel[issue.path] ?? issue.path}</strong> {issue.message}
                  </li>
                ))}
              </ul>
            )}
            {error.retryAfterMs ? (
              <div className="notice__body" style={{ fontSize: "0.85rem", opacity: 0.8 }}>
                Retry in roughly {Math.ceil(error.retryAfterMs / 1000)}s.
              </div>
            ) : null}
          </div>
        )}
      </form>
    </div>
  );
}

function Field({
  name,
  label,
  hint,
  children,
  error,
}: {
  name: string;
  label: string;
  hint?: string;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <div className="spec__row" data-field={name}>
      <div className="spec__label">
        <span>{label}</span>
        {hint && <small>{hint}</small>}
      </div>
      {children}
      {error && <span className="spec__error">{error}</span>}
    </div>
  );
}
