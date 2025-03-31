export default function EntryCard({
  createdAt,
  summary,
  mood,
}: {
  createdAt: Date;
  summary: string;
  mood: string;
}) {
  const date = createdAt.toDateString();

  return (
    <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow">
      <div className="px-4 py-5">{date}</div>
      <div className="px-4 py-5">{summary}</div>
      <div className="px-4 py-5">{mood}</div>
    </div>
  );
}
