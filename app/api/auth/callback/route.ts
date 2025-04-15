import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { prisma } from "@/utils/db";

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/register");
  }

  const url = new URL(req.url);
  const redirectUrl = url.searchParams.get("redirectUrl") || "/journal";

  const existingUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!existingUser) {
    await prisma.user.create({
      data: { clerkId: userId },
    });
  }

  redirect(redirectUrl);
}
