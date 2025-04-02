"use client";

import { useRouter } from "next/navigation";

import { createEntry } from "@/utils/api";

export default function NewEntryCard() {
  const router = useRouter();

  const handleCreateEntry = async () => {
    const entry = await createEntry();
    router.push(`/journal/${entry.id}`);
  };

  return (
    <button
      className="cursor-pointer bg-indigo-600 py-2 px-4 rounded text-white"
      onClick={() => handleCreateEntry()}
    >
      New Entry
    </button>
  );
}
