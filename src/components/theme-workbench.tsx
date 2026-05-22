"use client";

import { useMemo, useState } from "react";
import { GenerationResult } from "./generation-result";
import { ThemeForm } from "./theme-form";
import { GenerationErrorPayload, GenerationResultPayload } from "./types";

function issueDate(): string {
  return new Date()
    .toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric", year: "numeric" })
    .toUpperCase();
}

export function ThemeWorkbench() {
  const [result, setResult] = useState<GenerationResultPayload | null>(null);
  const [error, setError] = useState<GenerationErrorPayload | undefined>();
  const [dateline] = useState<string>(() => issueDate());

  const filesCount = useMemo(() => result?.files.length ?? 17, [result]);

  return (
    <>
      <header className="page masthead">
        <div className="masthead-strip reveal reveal-1">
          <span>AI WP THEME GENERATOR · VOL. I · N° 01</span>
          <span>
            <a href="https://ai-wp-theme-generator.vercel.app" target="_blank" rel="noreferrer">
              ai-wp-theme-generator.vercel.app
            </a>
          </span>
        </div>
        <h1 className="masthead-title reveal reveal-2">
          A specimen of <em>generated</em> block themes.
        </h1>
        <div className="masthead-standfirst reveal reveal-3">
          A constrained brief is set in serif, a deterministic compiler casts the type,
          a layered validator reads proofs, and a single bundled <strong>.zip</strong>
          {" "}is sent to press &mdash; without ever asking a language model to write
          WordPress markup by hand.
        </div>
        <div className="masthead-meta reveal reveal-4">
          <div>
            <strong>Dateline</strong>
            <span suppressHydrationWarning>{dateline || "—"}</span>
          </div>
          <div>
            <strong>Compositor</strong>
            Deterministic block-theme compiler
          </div>
          <div>
            <strong>Edition size</strong>
            {filesCount} files · single bundled .zip
          </div>
          <div>
            <strong>Validator</strong>
            Layered, fails loudly
          </div>
        </div>
      </header>

      <main className="page workbench">
        <section className="workbench__brief reveal reveal-5" aria-label="Theme brief">
          <ThemeForm
            error={error}
            onResult={(nextResult, nextError) => {
              setResult(nextResult);
              setError(nextError);
            }}
          />
        </section>

        <section className="workbench__output reveal reveal-5" aria-label="Generated theme">
          {result ? (
            <GenerationResult result={result} />
          ) : (
            <div className="empty">
              <div className="label">§ 02 — 04 · awaiting brief</div>
              <p className="empty__display">
                <em>The press is set.</em>
              </p>
              <p className="empty__caption">
                Type a brief on the left and click <strong>SET THEME</strong>. The preview, audit log,
                and bound index will appear here.
              </p>
            </div>
          )}
        </section>
      </main>

      <footer className="page colophon">
        <div>
          <em>The AI Theme Generator</em> &nbsp;·&nbsp; Editorial &amp; production: Kelly Hannel · Composition: Claude (Opus 4.7) ·
          Pressed on Vercel · Set in Fraunces, Instrument Serif, JetBrains Mono.
        </div>
        <div>
          <a
            href="https://github.com/jakekinchen/ai-wp-theme-generator"
            target="_blank"
            rel="noreferrer"
            style={{ borderBottom: "1px solid currentColor", paddingBottom: "1px", textDecoration: "none" }}
          >
            Source — Github
          </a>
        </div>
      </footer>
    </>
  );
}
