import HistoryChart from "@/components/HistoryChart";
import { getUserByClerkId } from "@/utils/auth";
import { prisma } from "@/utils/db";

const getData = async () => {
  const user = await getUserByClerkId();
  const analyses = await prisma.analysis.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
  const total = analyses.reduce((acc, curr) => {
    return acc + curr.sentimentScore;
  }, 0);
  const average = total / analyses.length;
  return { analyses, average };
};

export default async function Page() {
  const { analyses, average } = await getData();

  let overallSentiment = "neutral";
  if (average < -2) overallSentiment = "negative";
  if (average >= 2) overallSentiment = "positive";

  return (
    <div className="p-10 bg-zinc-500/10 h-full">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl">History</h2>
          <p>
            Avg. Sentiment: {average.toFixed(2)} ({overallSentiment})
          </p>
        </div>
      </div>
      <div className="h-[600px]">
        <HistoryChart data={analyses} />
      </div>
    </div>
  );
}
