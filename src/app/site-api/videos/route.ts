import { getCachedApiJson } from "@/lib/apiCache";

// Danh sách video cho trang chủ, đi qua bộ nhớ đệm phía server để trình duyệt
// không phải chờ back-end thức dậy.
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const json = (await getCachedApiJson("/api/videos")) as { data?: unknown };
    return Response.json(
      { data: Array.isArray(json.data) ? json.data : [] },
      { headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=600" } },
    );
  } catch {
    return Response.json({ data: [] }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
