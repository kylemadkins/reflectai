"use client";

import { useEffect, useState } from "react";

import { updateEntry } from "@/utils/actions";
import { useDebounce } from "@/hooks/useDebounce";
import Spinner from "./Spinner";
import { Prisma } from "@prisma/client";

export default function Editor({
  entry,
}: {
  entry: Prisma.EntryGetPayload<{ include: { analysis: true } }>;
}) {
  const [value, setValue] = useState(entry.content);
  const debouncedValue = useDebounce(value);
  const [isUpdating, setIsUpdating] = useState(false);
  const [analysis, setAnalysis] = useState(entry.analysis);

  useEffect(() => {
    const update = async () => {
      setIsUpdating(true);
      const updatedEntry = await updateEntry(entry.id, debouncedValue);
      setAnalysis(updatedEntry?.analysis ?? null);
      setIsUpdating(false);
    };

    update();
  }, [entry.id, debouncedValue]);

  const analysisData = [
    {
      name: "Summary",
      value: analysis?.summary ?? "",
    },
    {
      name: "Subject",
      value: analysis?.subject ?? "",
    },
    {
      name: "Mood",
      value: analysis?.mood ?? "",
    },
    {
      name: "Negative",
      value: analysis?.negative ? "True" : "False",
    },
  ];

  return (
    <div className="h-full grid grid-cols-3">
      <div className="col-span-2">
        <div className="p-10 h-full relative">
          <textarea
            className="h-full w-full focus:outline-none"
            value={value}
            onChange={(evt) => setValue(evt.target.value)}
          />
          {isUpdating ? (
            <Spinner className="absolute w-6 h-6 top-8 right-8" />
          ) : (
            ""
          )}
        </div>
      </div>
      <div className="border-l border-black/10">
        <div
          className="px-6 py-10 border-b border-black/10"
          style={{ backgroundColor: analysis?.color ?? "#fff" }}
        >
          <h2 className="text-2xl">Analysis</h2>
        </div>
        <ul>
          {analysisData.map((item) => (
            <li key={item.name} className="px-6 py-4 border-b border-black/10">
              <div className="text-lg font-semibold">{item.name}</div>
              <div>{item.value}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
