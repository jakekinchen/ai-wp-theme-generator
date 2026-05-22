import { ThemeFileMap } from "@/lib/compiler/file-map";

export function FileViewer({ files, path }: { files: ThemeFileMap; path: string }) {
  const file = files.find((item) => item.path === path) ?? files[0];
  return (
    <pre className="max-h-80 overflow-auto rounded border border-slate-200 bg-slate-950 p-4 text-xs text-slate-100">
      <code>{file?.content}</code>
    </pre>
  );
}
