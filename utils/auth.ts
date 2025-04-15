import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { prisma } from "./db";

export const getUserByClerkId = async () => {
  const { userId } = await auth();

  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        clerkId: userId || undefined,
      },
    });
    return user;
  } catch (err) {
    redirect("/");
  }
};
