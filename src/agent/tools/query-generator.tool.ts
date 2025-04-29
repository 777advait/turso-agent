import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { queryGeneratorChain } from "../chains";

export const queryGeneratorTool = tool(
  async ({ question }: { question: string }) =>
    queryGeneratorChain.generateQuery(question),
  {
    name: "query-generator-tool",
    description:
      "generates a sql query based on a standalone question and schema",
    schema: z.object({
      question: z
        .string()
        .describe(
          "a standalone question to generate a sql query based on the provided schema"
        ),
    }),
  }
);
