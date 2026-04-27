import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.role !== "ADMIN") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const history = await prisma.promptHistory.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return Response.json({ history });
  } catch {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
