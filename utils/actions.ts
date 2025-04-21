"use server";

import { prisma } from "./db";
import { getUserByClerkId } from "./auth";
import { revalidatePath } from "next/cache";
import { analyze, qa } from "./ai";

export async function createEntry() {
  const user = await getUserByClerkId();

  const entry = await prisma.entry.create({
    data: {
      userId: user.id,
      content: "Write about your day!",
    },
  });

  const analysis = await analyze(entry.content);

  if (analysis) {
    await prisma.analysis.create({
      data: { entryId: entry.id, ...analysis },
    });
  }

  revalidatePath("/journal");

  return entry;
}

export async function updateEntry(id: string, content: string) {
  const user = await getUserByClerkId();

  await prisma.entry.update({
    where: {
      id: id,
      userId: user.id,
    },
    data: {
      content,
    },
  });

  const analysis = await analyze(content);

  if (analysis) {
    await prisma.analysis.update({
      where: {
        entryId: id,
      },
      data: { entryId: id, ...analysis },
    });
  }

  const entry = await prisma.entry.findUnique({
    where: {
      id,
    },
    include: {
      analysis: true,
    },
  });

  return entry;
}

export async function askQuestion(question: string) {
  const user = await getUserByClerkId();

  const entries = await prisma.entry.findMany({
    where: { userId: user.id },
    select: { id: true, content: true, createdAt: true },
  });

  const answer = await qa(question, entries);

  return answer;
}
