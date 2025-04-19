import { tool } from "@langchain/core/tools";
import { z } from "zod";

export const generateStandaloneQuestion = tool(
  ({ query }: { query: string }): string => {
    return "hello";
  },
  {
    name: "generate-standalone-question",
    description: "generates a standalone question from natural language prompt",
    schema: z.object({
      query: z.string().describe("natural language prompt"),
    }),
  }
);
