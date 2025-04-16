import Link from "next/link";

import EntryCard from "@/components/EntryCard";
import NewEntryButton from "@/components/NewEntryButton";
import { getUserByClerkId } from "@/utils/auth";
import { prisma } from "@/utils/db";

const getEntries = async () => {
  const user = await getUserByClerkId();

  const entries = prisma.entry.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      analysis: true,
    },
  });

  return entries;
};

export default async function Page() {
  const entries = await getEntries();

  return (
    <div className="p-10 bg-zinc-500/10 min-h-full">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-3xl">Journal</h2>
        <NewEntryButton />
      </div>
      <div className="grid grid-cols-3 gap-4 ">
        {entries.map((entry) => (
          <Link key={entry.id} href={`/journal/${entry.id}`}>
            <EntryCard
              createdAt={entry.createdAt}
              summary={entry.analysis?.summary ?? "Summary"}
              mood={entry.analysis?.mood ?? "Mood"}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
