import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { createSessionToken, SESSION_COOKIE } from "@/lib/auth";
import type { SessionUser } from "@/types";

export async function POST(request: Request) {
  try {
    const { name, email, password, organizationName, role } = await request.json();

    if (!name || !email || !password || !organizationName) {
      return Response.json({ error: "All fields required" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return Response.json({ error: "Email already registered" }, { status: 409 });
    }

    let organization = await prisma.organization.findFirst({
      where: { name: organizationName },
    });

    if (!organization) {
      organization = await prisma.organization.create({
        data: { name: organizationName },
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: role === "ADMIN" ? "ADMIN" : "USER",
        organizationId: organization.id,
      },
      include: { organization: true },
    });

    const sessionUser: SessionUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as "ADMIN" | "USER",
      organizationId: user.organizationId,
      organizationName: user.organization.name,
    };

    const token = createSessionToken(sessionUser);

    const response = Response.json({ user: sessionUser });
    const headers = new Headers(response.headers);
    headers.set(
      "Set-Cookie",
      `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`
    );

    return new Response(response.body, { status: 201, headers });
  } catch {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
