import JSZip from "jszip";
import { ThemeFileMap } from "@/lib/compiler/file-map";

export async function createThemeZip(files: ThemeFileMap): Promise<Buffer> {
  const zip = new JSZip();
  const seen = new Set<string>();
  for (const file of files) {
    const normalized = file.path.replaceAll("\\", "/");
    if (normalized.startsWith("/") || normalized.includes("..") || seen.has(normalized)) {
      throw new Error(`Unsafe zip path: ${file.path}`);
    }
    seen.add(normalized);
    zip.file(normalized, file.content);
  }
  return zip.generateAsync({ type: "nodebuffer" });
}
