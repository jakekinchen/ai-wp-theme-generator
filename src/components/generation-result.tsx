"use client";

import { useMemo, useState } from "react";
import { DownloadButton } from "./download-button";
import { FileTree } from "./file-tree";
import { FileViewer } from "./file-viewer";
import { SectionHead } from "./section-head";
import { ThemePreview } from "./theme-preview";
import { GenerationResultPayload } from "./types";
import { ValidationReport } from "./validation-report";

export function GenerationResult({ result }: { result: GenerationResultPayload }) {
  const firstPath = result.files[0]?.path ?? "";
  const [selectedPath, setSelectedPath] = useState(firstPath);
  const selected = useMemo(() => selectedPath || firstPath, [firstPath, selectedPath]);
  const totalBytes = useMemo(
    () => result.files.reduce((sum, file) => sum + file.content.length, 0),
    [result.files],
  );

  return (
    <div style={{ display: "grid", gap: "clamp(2.5rem, 4vw, 3.5rem)" }}>
      <section className="section">
        <SectionHead
          id="02"
          title="The proof."
          meta={`Direction · ${result.plan.design.direction.replace(/-/g, " ")}`}
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr)",
            gap: "1.25rem",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
              alignItems: "flex-end",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "grid", gap: "0.35rem" }}>
              <div className="label">Volume title</div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontVariationSettings: "\"opsz\" 144",
                  fontSize: "clamp(2rem, 4vw, 3.2rem)",
                  lineHeight: 0.95,
                  letterSpacing: "-0.025em",
                }}
              >
                {result.plan.meta.name}
              </div>
            </div>
            <DownloadButton
              zipBase64={result.zipBase64}
              disabled={result.validation.status !== "passed"}
              slug={result.plan.meta.slug}
            />
          </div>
          <p className="preview__rationale" style={{ marginTop: "0.25rem" }}>
            “{result.plan.design.rationale}”
          </p>
        </div>

        {result.designSelection && (
          <div className="design-desk" aria-label="Design selection">
            <div className="design-desk__lead">
              <span className="label">Design desk</span>
              <strong>{result.designSelection.criticSummary}</strong>
              <span>{result.designSelection.selectedScore}/100 · selected {result.designSelection.selectedId}</span>
            </div>
            <div className="design-desk__grid">
              {result.designSelection.candidates.map((candidate) => (
                <article
                  className="design-desk__candidate"
                  data-selected={candidate.id === result.designSelection?.selectedId ? "true" : "false"}
                  key={candidate.id}
                >
                  <div>
                    <span className="label">{candidate.role.replace(/-/g, " ")}</span>
                    <strong>{candidate.direction.replace(/-/g, " ")}</strong>
                  </div>
                  <div className="design-desk__score">{candidate.score}</div>
                  <p>{candidate.verdict}</p>
                  <small>{candidate.strengths[0] ?? candidate.risks[0] ?? "Design candidate scored locally."}</small>
                </article>
              ))}
            </div>
          </div>
        )}

        <div className="preview-frame">
          <ThemePreview plan={result.plan} />
        </div>
      </section>

      <section className="section">
        <SectionHead
          id="03"
          title="The proofreader."
          meta={`${result.validation.checks.length} checks`}
        />
        <ValidationReport validation={result.validation} />
      </section>

      <section className="section">
        <SectionHead
          id="04"
          title="The bound index."
          meta={`${result.files.length} files · ${(totalBytes / 1024).toFixed(1)} KB uncompressed`}
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr)",
            gap: "1.5rem",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr)",
              gap: "1.5rem",
            }}
          >
            <FileTree files={result.files} selectedPath={selected} onSelect={setSelectedPath} />
            <FileViewer files={result.files} path={selected} />
          </div>
        </div>
      </section>
    </div>
  );
}
