import { ThemeFileMap } from "@/lib/compiler/file-map";

const LEADER = ".".repeat(120);

export function FileTree({
  files,
  selectedPath,
  onSelect,
}: {
  files: ThemeFileMap;
  selectedPath: string;
  onSelect: (path: string) => void;
}) {
  return (
    <div className="index-list" role="listbox" aria-label="Generated files">
      {files.map((file, index) => {
        const isSelected = file.path === selectedPath;
        const bytes = file.content.length;
        return (
          <button
            key={file.path}
            type="button"
            className="index-row"
            onClick={() => onSelect(file.path)}
            aria-selected={isSelected}
            role="option"
          >
            <span className="index-row__num">{String(index + 1).padStart(2, "0")}</span>
            <span className="index-row__path">
              <span>{file.path}</span>
              <span className="index-row__leader" aria-hidden>{LEADER}</span>
            </span>
            <span className="index-row__bytes">{formatBytes(bytes)}</span>
          </button>
        );
      })}
    </div>
  );
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}
