export function DownloadButton({ zipBase64, disabled }: { zipBase64?: string; disabled: boolean }) {
  function download() {
    if (!zipBase64) return;
    const bytes = Uint8Array.from(atob(zipBase64), (char) => char.charCodeAt(0));
    const blob = new Blob([bytes], { type: "application/zip" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "generated-theme.zip";
    link.click();
    URL.revokeObjectURL(link.href);
  }

  return (
    <button type="button" onClick={download} disabled={disabled || !zipBase64} className="rounded bg-emerald-700 px-4 py-2 text-sm font-semibold text-white disabled:bg-slate-400">
      Download zip
    </button>
  );
}
