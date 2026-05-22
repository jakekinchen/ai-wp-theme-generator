"use client";

export function DownloadButton({
  zipBase64,
  disabled,
  slug,
}: {
  zipBase64?: string;
  disabled: boolean;
  slug: string;
}) {
  function download() {
    if (!zipBase64) return;
    const bytes = Uint8Array.from(atob(zipBase64), (char) => char.charCodeAt(0));
    const blob = new Blob([bytes], { type: "application/zip" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${slug}.zip`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  return (
    <button
      type="button"
      onClick={download}
      disabled={disabled || !zipBase64}
      className="press press--accent"
    >
      <span className="press__num">↓</span>
      {disabled ? "Press halted" : "Pull a copy · .zip"}
    </button>
  );
}
