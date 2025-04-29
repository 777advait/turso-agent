import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { standaloneQuestionChain } from "../chains";

export const standaloneQuestionTool = tool(
  async ({ question }: { question: string }) =>
    await standaloneQuestionChain.generateStandaloneQuestion(question),
  {
    name: "standalone-question-tool",
    description:
      "generates a standalone question from natural language prompt related to data, insights or sql",
    schema: z.object({
      question: z
        .string()
        .describe(
          "a natural language prompt to generate a standalone question from"
        ),
    }),
  }
);
