"use client";

import { useState } from "react";
import { GenerationResult } from "./generation-result";
import { ThemeForm } from "./theme-form";
import { GenerationErrorPayload, GenerationResultPayload } from "./types";

export function ThemeWorkbench() {
  const [result, setResult] = useState<GenerationResultPayload | null>(null);
  const [error, setError] = useState<GenerationErrorPayload | undefined>();

  return (
    <main className="min-h-screen bg-stone-50 text-slate-950">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-8 lg:grid-cols-[420px_1fr]">
        <section className="grid content-start gap-5">
          <div>
            <h1 className="text-3xl font-semibold">AI WordPress Theme Generator</h1>
            <p className="mt-2 text-sm text-slate-600">Generate a constrained ThemePlan, compile safe block-theme files, validate the output, and download a zip.</p>
          </div>
          <ThemeForm
            error={error}
            onResult={(nextResult, nextError) => {
              setResult(nextResult);
              setError(nextError);
            }}
          />
        </section>
        <section className="min-w-0 rounded border border-slate-200 bg-white p-5">
          {result ? (
            <GenerationResult result={result} />
          ) : (
            <div className="grid min-h-[520px] place-items-center rounded border border-dashed border-slate-300 text-center text-sm text-slate-500">
              Generated preview, validation report, file tree, and download controls appear here.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
