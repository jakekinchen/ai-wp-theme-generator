import { ThemeFileMap } from "@/lib/compiler/file-map";
import { validateFileMap } from "@/lib/validation/validate-file-map";
import { PackagingError } from "@/lib/utils/errors";
import { createThemeZip } from "./create-theme-zip";

export async function packageTheme(files: ThemeFileMap): Promise<Buffer> {
  const validation = validateFileMap(files);
  if (validation.status === "failed") {
    throw new PackagingError("Generated theme failed validation and cannot be zipped.", validation);
  }
  return createThemeZip(files);
}
