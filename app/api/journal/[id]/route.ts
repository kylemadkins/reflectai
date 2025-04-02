import { getUserByClerkId } from "@/utils/auth";
import { prisma } from "@/utils/db";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const user = await getUserByClerkId();
  const { id } = await params;
  const { content } = await req.json();

  const updatedEntry = await prisma.entry.update({
    where: {
      id: id,
      userId: user.id,
    },
    data: {
      content,
    },
  });

  return NextResponse.json({ data: updatedEntry });
};
