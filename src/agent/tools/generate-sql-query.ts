import { tool } from "@langchain/core/tools";
import { z } from "zod";

export const generateSQLQuery = tool(
  ({ query }: { query: string }): string => {
    /**
     * @param {string} query - natural language query
     * @returns {string} genrated sql query
     * @description - this tool generates a sql query from natural language query
     */

    return "hello";
  },
  {
    name: "generate-sql-query",
    description: "generates a sql query from natural language prompt",
    schema: z.object({
      query: z.string().describe("natural language prompt"),
    }),
  }
);
