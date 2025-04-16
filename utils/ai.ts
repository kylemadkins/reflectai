import { PromptTemplate } from "langchain";
import { OpenAI } from "langchain/llms/openai";
import { StructuredOutputParser } from "langchain/output_parsers";
import z from "zod";

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
