import { ThemeFileMap } from "@/lib/compiler/file-map";

export function FileTree({ files, selectedPath, onSelect }: { files: ThemeFileMap; selectedPath: string; onSelect: (path: string) => void }) {
  return (
    <div className="max-h-80 overflow-auto rounded border border-slate-200">
      {files.map((file) => (
        <button
          key={file.path}
          type="button"
          onClick={() => onSelect(file.path)}
          className={`block w-full border-b border-slate-100 px-3 py-2 text-left font-mono text-xs last:border-b-0 ${file.path === selectedPath ? "bg-slate-900 text-white" : "hover:bg-slate-50"}`}
        >
          {file.path}
        </button>
      ))}
    </div>
  );
}
