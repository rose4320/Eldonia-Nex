import { NextResponse, type NextRequest } from "next/server";

/** @deprecated Use /api/gallery/artworks/[id]/download */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const url = new URL(request.url);
  const target = new URL(
    `/api/gallery/artworks/${id}/download${url.search}`,
    url.origin,
  );
  return NextResponse.redirect(target);
}
