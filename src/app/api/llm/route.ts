import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import type { Priority } from "@/types";

function mockLLMPriority(description: string): Priority {
  const lower = description.toLowerCase();
  if (
    lower.includes("urgent") ||
    lower.includes("critical") ||
    lower.includes("emergency") ||
    lower.includes("immediate") ||
    lower.includes("severe") ||
    lower.includes("life") ||
    lower.includes("danger")
  ) {
    return "HIGH";
  }
  if (
    lower.includes("moderate") ||
    lower.includes("soon") ||
    lower.includes("important") ||
    lower.includes("need") ||
    lower.includes("require") ||
    lower.includes("flood") ||
    lower.includes("shortage")
  ) {
    return "MEDIUM";
  }
  return "LOW";
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

    const { description, lat, lng } = await request.json();

    if (!description) {
      return Response.json({ error: "description required" }, { status: 400 });
    }

    const priority = mockLLMPriority(description);

    await prisma.task.create({
      data: {
        description,
        priority,
        status: "OPEN",
        lat: lat ? parseFloat(lat) : 20.5937,
        lng: lng ? parseFloat(lng) : 78.9629,
        organizationId: session.organizationId,
      },
    });

    await prisma.promptHistory.create({
      data: {
        input: description,
        assignedPriority: priority,
        status: "OPEN",
      },
    });

    return Response.json({ priority }, { status: 201 });
  } catch {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
