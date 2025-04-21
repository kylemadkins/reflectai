"use client";

import { askQuestion } from "@/utils/actions";
import { SyntheticEvent, useState } from "react";
import Spinner from "./Spinner";

const Question = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (evt: SyntheticEvent<HTMLFormElement>) => {
    evt.preventDefault();
    setAnswer("");
    setIsLoading(true);
    const answer = await askQuestion(question);
    setAnswer(answer);
    setIsLoading(false);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex gap-8 bg-white shadow pr-2 rounded items-center"
      >
        <input
          disabled={isLoading}
          type="text"
          placeholder="Ask a question..."
          onChange={(evt) => setQuestion(evt.target.value)}
          className="w-full p-4 focus:outline-none"
        />
        {isLoading ? (
          <Spinner className="h-6 w-6 mr-4" />
        ) : (
          <button className="cursor-pointer bg-indigo-600 px-4 py-2 rounded text-white">
            Ask
          </button>
        )}
      </form>
      {isLoading ? (
        <p className="mt-4">Thinking...</p>
      ) : answer ? (
        <p className="mt-4">{answer}</p>
      ) : (
        ""
      )}
    </>
  );
};

export default Question;
