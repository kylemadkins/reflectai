import { notFound } from "next/navigation";

import Editor from "@/components/Editor";
import { getUserByClerkId } from "@/utils/auth";
import { prisma } from "@/utils/db";

const getEntry = async (id: string) => {
  const user = await getUserByClerkId();
  const entry = await prisma.entry.findUnique({
    where: {
      id,
      userId: user.id,
    },
  });
  return entry;
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const entry = await getEntry(id);

  if (!entry) {
    notFound();
  }

  return (
    <div className="w-full h-full">
      <Editor id={entry.id} content={entry.content} />
    </div>
  );
}
