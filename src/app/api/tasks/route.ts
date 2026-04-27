import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tasks = await prisma.task.findMany({
      where: { organizationId: session.organizationId },
      orderBy: { createdAt: "desc" },
    });

    return Response.json({ tasks });
  } catch {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.role !== "ADMIN") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const { description, priority, status, lat, lng } = await request.json();

    if (!description || !lat || !lng) {
      return Response.json({ error: "description, lat, lng required" }, { status: 400 });
    }

    const task = await prisma.task.create({
      data: {
        description,
        priority: priority ?? "MEDIUM",
        status: status ?? "OPEN",
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        organizationId: session.organizationId,
      },
    });

    return Response.json({ task }, { status: 201 });
  } catch {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.role !== "ADMIN") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id, description, priority, status, lat, lng } = await request.json();
    if (!id) {
      return Response.json({ error: "id required" }, { status: 400 });
    }

    const task = await prisma.task.update({
      where: { id },
      data: {
        ...(description !== undefined && { description }),
        ...(priority !== undefined && { priority }),
        ...(status !== undefined && { status }),
        ...(lat !== undefined && { lat: parseFloat(lat) }),
        ...(lng !== undefined && { lng: parseFloat(lng) }),
      },
    });

    return Response.json({ task });
  } catch {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.role !== "ADMIN") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await request.json();
    if (!id) {
      return Response.json({ error: "id required" }, { status: 400 });
    }

    await prisma.task.delete({ where: { id } });

    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
