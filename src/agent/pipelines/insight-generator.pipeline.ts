import { RunnableSequence } from "@langchain/core/runnables";
import { standaloneQuestionTool } from "../tools/standalone-question.tool";
import { queryGeneratorTool, runSQL } from "../tools";
import type { IInsightGenerator } from "@/utils/interfaces/insight-generator.interface";
import { llm } from "..";
import { SYSTEM_PROMPT } from "../prompts";
import type { AIMessageChunk } from "@langchain/core/messages";

class InsightGenerator implements IInsightGenerator {
  private insightGenerator = RunnableSequence.from<string, AIMessageChunk>([
    async (question: string) => {
      const standaloneQuestion = await standaloneQuestionTool.invoke({
        question,
      });

      const result = {
        originalPrompt: question,
        standaloneQuestion: standaloneQuestion as string,
      };
      return result;
    },

    async ({
      originalPrompt,
      standaloneQuestion,
    }: {
      originalPrompt: string;
      standaloneQuestion: string;
    }) => {
      const query = await queryGeneratorTool.invoke({
        question: standaloneQuestion,
      });

      const result = {
        query,
        originalPrompt,
        isWriteQuery: !/^\s*select/i.test(query),
      };
      return result;
    },

    async (ctx: {
      isWriteQuery: boolean;
      query: string;
      originalPrompt: string;
    }) => {
      if (ctx.isWriteQuery) {
        return ctx;
      }

      const result = await runSQL(ctx.query);

      return {
        ...ctx,
        result,
      };
    },

    async (ctx: {
      isWriteQuery: boolean;
      query: string;
      originalPrompt: string;
      result?: any;
    }) => {
      let prompt: string;

      if (ctx.isWriteQuery) {
        prompt = `
        Given the user's prompt, executed query and result of the query, generate an insights report based on the query result and user's prompt.
        Your response should always consist of the following parts:
        - The query that was executed
        - A small jist of the query result 
        - A conclusion that summarizes the insights report.

        User prompt: ${ctx.originalPrompt}
        Generated query: ${ctx.query}
        NOTE: This query was not executed because write operations are not allowed.

        The report is:
        `;
      } else {
        prompt = `
        Given the user's prompt, executed query and result of the query, generate an insights report based on the query result and user's prompt.
        Your response should always consist of the following parts:
        - The query that was executed
        - A small jist of the query result 
        - A conclusion that summarizes the insights report.

        User prompt: ${ctx.originalPrompt}
        Executed query: ${ctx.query}
        Query result: ${JSON.stringify(ctx.result)}

        The report is:
        `;
      }

      const response = await this.sendToLLM(prompt);

      return response;
    },
  ]);

  private async sendToLLM(prompt: string): Promise<AIMessageChunk> {
    return await llm.invoke([
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: prompt },
    ]);
  }

  async run(input: string): Promise<AIMessageChunk> {
    return await this.insightGenerator.invoke(input);
  }
}

export const insightGenerator = new InsightGenerator();
