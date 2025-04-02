"use client";

import { useEffect, useState } from "react";

import { updateEntry } from "@/utils/api";
import { useDebounce } from "@/hooks/useDebounce";
import Spinner from "./Spinner";

export default function Editor({
  id,
  content,
}: {
  id: string;
  content: string;
}) {
  const [value, setValue] = useState(content);
  const debouncedValue = useDebounce(value);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const update = async () => {
      setIsUpdating(true);
      await updateEntry(id, debouncedValue);
      setIsUpdating(false);
    };

    update();
  }, [id, debouncedValue]);

  return (
    <div className="p-10 h-full w-full relative">
      <textarea
        className="h-full w-full focus:outline-none"
        value={value}
        onChange={(evt) => setValue(evt.target.value)}
      />
      {isUpdating ? <Spinner className="absolute w-6 h-6 top-8 right-8" /> : ""}
    </div>
  );
}
