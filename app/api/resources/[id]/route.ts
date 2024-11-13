import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

async function checkAdminAuth() {
  const cookieStore = cookies();
  const authToken = cookieStore.get("auth-token");

  if (!authToken) {
    return null;
  }

  try {
    const tokenData = JSON.parse(authToken.value);
    const user = await db.user.findUnique({
      where: {
        email: tokenData.email,
      },
      select: {
        id: true,
        role: true,
      },
    });

    if (!user || user.role !== "ADMIN") {
      return null;
    }

    return user;
  } catch {
    return null;
  }
}

// PUT (update) resource
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await checkAdminAuth();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const resource = await db.resource.update({
      where: { id: params.id },
      data,
    });

    return NextResponse.json(resource);
  } catch {
    return NextResponse.json({ error: "Failed to update resource" }, { status: 500 });
  }
}

// DELETE resource
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await checkAdminAuth();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await db.resource.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Resource deleted successfully" });
  } catch {
    return NextResponse.json({ error: "Failed to delete resource" }, { status: 500 });
  }
}
