import { PromptTemplate } from "langchain/prompts";
import { Document } from "langchain/document";
import { OpenAI } from "langchain/llms/openai";
import { StructuredOutputParser } from "langchain/output_parsers";
import { loadQARefineChain } from "langchain/chains";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import z from "zod";
import type { Prisma } from "@prisma/client";

const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    color: z
      .string()
      .describe(
        "a hexadecimal color code representing the overall emotional tone of the entry, e.g., '#FFD700' for happy, '#708090' for somber"
      ),
    summary: z
      .string()
      .describe(
        "a brief paragraph summary of the journal entry, capturing the key events or feelings expressed"
      ),
    subject: z
      .string()
      .describe(
        "a concise noun or phrase summarizing the primary topic or theme"
      ),
    mood: z
      .string()
      .describe("a single word that best captures the writer's emotional tone"),
    negative: z
      .boolean()
      .describe(
        "true or false depending on whether the journal entry reflects a predominantly negative experience"
      ),
  })
);

const createPrompt = async (content: string) => {
  const formatInstructions = parser.getFormatInstructions();

  const prompt = new PromptTemplate({
    template: `You are an assistant that analyzes journal entries to extract emotional and contextual metadata.\n{formatInstructions}\nHere is the journal entry:\n{content}`,
    inputVariables: ["content"],
    partialVariables: { formatInstructions },
  });

  const input = await prompt.format({ content });

  return input;
};

export const analyze = async (content: string) => {
  const model = new OpenAI({ modelName: "gpt-3.5-turbo", temperature: 0 });

  const input = await createPrompt(content);

  const res = await model.call(input);

  try {
    return parser.parse(res);
  } catch (err) {
    console.log(err);
  }
};

export const qa = async (
  question: string,
  entries: Prisma.EntryGetPayload<{
    select: { id: true; content: true; createdAt: true };
  }>[]
) => {
  entries.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const docs = entries.map(
    (entry) =>
      new Document({
        pageContent: `Jounral Entry on ${entry.createdAt}:\n${entry.content}`,
        metadata: { id: entry.id, createdAt: entry.createdAt },
      })
  );

  const model = new OpenAI({ modelName: "gpt-3.5-turbo", temperature: 0 });

  const questionPrompt = new PromptTemplate({
    inputVariables: ["context", "question"],
    template: `
      You are a friendly personal assistant analyzing journal entries. Refer to the user in 2nd person. Each entry includes a clear date.
      
      When answering, make sure to pay attention to the **chronological order of events**, based on the provided dates. Do not infer that an entry comes before or after another unless explicitly stated.
      
      Question: {question}
      
      Context:
      {context}
      
      Answer:
    `,
  });
  const refinePrompt = new PromptTemplate({
    inputVariables: ["question", "existing_answer", "context"],
    template: `
      You are refining an answer based on new journal entries.
      
      Carefully look at the new entries and update the answer only if there is **new or corrected information**.
      
      Question: {question}
      Existing Answer: {existing_answer}
      New Context:
      {context}
      
      If there's no new relevant information, just repeat the original answer **without extra commentary**.
      
      Final Answer:
    `,
  });
  const chain = loadQARefineChain(model, {
    questionPrompt,
    refinePrompt,
  });

  const embeddings = new OpenAIEmbeddings();

  const store = await MemoryVectorStore.fromDocuments(docs, embeddings);

  const relevantDocs = await store.similaritySearch(question);

  const res = await chain.call({
    input_documents: relevantDocs,
    question,
  });

  return res.output_text;
};
