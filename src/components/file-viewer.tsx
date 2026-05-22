import { ThemeFileMap } from "@/lib/compiler/file-map";

export function FileViewer({ files, path }: { files: ThemeFileMap; path: string }) {
  const file = files.find((item) => item.path === path) ?? files[0];
  const bytes = file?.content.length ?? 0;
  const lines = file?.content.split("\n").length ?? 0;

  return (
    <div className="viewer">
      <div className="viewer__head">
        <span className="viewer__path">{file?.path ?? "—"}</span>
        <span className="viewer__meta">{lines} ln · {formatBytes(bytes)}</span>
      </div>
      <pre className="viewer__code">
        <code>{file?.content}</code>
      </pre>
    </div>
  );
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}
