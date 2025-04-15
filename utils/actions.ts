"use server";

import { prisma } from "./db";
import { getUserByClerkId } from "./auth";
import { revalidatePath } from "next/cache";

export async function createEntry() {
  const user = await getUserByClerkId();

  const entry = await prisma.entry.create({
    data: {
      userId: user.id,
      content: "Write about your day!",
    },
  });

  revalidatePath("/journal");

  return entry;
}

export async function updateEntry(id: string, content: string) {
  const user = await getUserByClerkId();

  const entry = await prisma.entry.update({
    where: {
      id: id,
      userId: user.id,
    },
    data: {
      content,
    },
  });

  return entry;
}
