"use client";

import { useMemo, useState } from "react";
import { DownloadButton } from "./download-button";
import { FileTree } from "./file-tree";
import { FileViewer } from "./file-viewer";
import { ThemePreview } from "./theme-preview";
import { GenerationResultPayload } from "./types";
import { ValidationReport } from "./validation-report";

export function GenerationResult({ result }: { result: GenerationResultPayload }) {
  const firstPath = result.files[0]?.path ?? "";
  const [selectedPath, setSelectedPath] = useState(firstPath);
  const selected = useMemo(() => selectedPath || firstPath, [firstPath, selectedPath]);

  return (
    <div className="grid gap-8">
      <section className="grid gap-2">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">{result.plan.meta.name}</h2>
            <p className="text-sm text-slate-600">{result.plan.design.rationale}</p>
          </div>
          <DownloadButton zipBase64={result.zipBase64} disabled={result.validation.status !== "passed"} />
        </div>
      </section>
      <ThemePreview plan={result.plan} />
      <ValidationReport validation={result.validation} />
      <section className="grid gap-3">
        <h2 className="text-lg font-semibold">Generated files</h2>
        <div className="grid gap-3 lg:grid-cols-[minmax(220px,320px)_1fr]">
          <FileTree files={result.files} selectedPath={selected} onSelect={setSelectedPath} />
          <FileViewer files={result.files} path={selected} />
        </div>
      </section>
    </div>
  );
}
