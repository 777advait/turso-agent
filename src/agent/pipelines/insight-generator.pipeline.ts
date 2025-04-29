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
      console.log("Step 1 - Input Question:", question);
      const standaloneQuestion = await standaloneQuestionTool.invoke({
        question,
      });

      const result = {
        originalPrompt: question,
        standaloneQuestion: standaloneQuestion as string,
      };
      console.log("Step 1 - Standalone Question:", result);
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
      console.log("Step 2 - Generated Query & Type:", result);
      return result;
    },

    async (ctx: {
      isWriteQuery: boolean;
      query: string;
      originalPrompt: string;
    }) => {
      if (ctx.isWriteQuery) {
        console.log("Step 3 - Write query detected, skipping execution");
        return ctx;
      }

      const result = await runSQL(ctx.query);
      console.log("Step 3 - SQL Execution Result:", result);

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
        prompt = `User prompt: ${ctx.originalPrompt}
Generated query: ${ctx.query}
NOTE: This query was not executed because write operations are not allowed.`;
      } else {
        prompt = `User prompt: ${ctx.originalPrompt}
Executed query: ${ctx.query}
Query result: ${JSON.stringify(ctx.result)}`;
      }

      console.log("Step 4 - Final Prompt to LLM:", prompt);
      const response = await this.sendToLLM(prompt);
      console.log("Step 4 - LLM Response:", response);

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
