import { createThemeZip } from "@/lib/packaging/create-theme-zip";
import { publicError } from "@/lib/utils/errors";
import { validateFileMap } from "@/lib/validation/validate-file-map";

export async function POST(request: Request) {
  try {
    const { files } = await request.json();
    const validation = validateFileMap(files);
    if (validation.status === "failed") {
      return Response.json({ validation, error: { message: "Files failed validation." } }, { status: 400 });
    }
    const zip = await createThemeZip(files);
    const body = new Blob([new Uint8Array(zip)]);
    return new Response(body, {
      headers: {
        "content-type": "application/zip",
        "content-disposition": "attachment; filename=\"generated-theme.zip\"",
      },
    });
  } catch (error) {
    return Response.json(publicError(error), { status: 400 });
  }
}
