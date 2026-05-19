export const runtime = "nodejs";

const adminUsername = process.env.COZY_ADMIN_USERNAME ?? "admin";
const adminPassword = process.env.COZY_ADMIN_PASSWORD ?? "cozy2026";
const adminToken = process.env.COZY_ADMIN_TOKEN ?? "cozy-designs-local-admin-token";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { password?: string; username?: string }
    | null;

  if (body?.username !== adminUsername || body?.password !== adminPassword) {
    return Response.json({ error: "Invalid admin login." }, { status: 401 });
  }

  return Response.json({ token: adminToken });
}
