import { PromptTemplate } from "@langchain/core/prompts";
import { QUERY_GENERATOR_PROMPT } from "../prompts";
import type { IQueryGenerator } from "@/utils/interfaces/query-generator.interface";
import type { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { getDatabaseSchema } from "@/utils/db/get-schema";
import { z } from "zod";

export class QueryGeneratorChain implements IQueryGenerator {
  private queryGeneratorChain;

  constructor(llm: BaseChatModel) {
    const promptTemplate = PromptTemplate.fromTemplate(QUERY_GENERATOR_PROMPT);
    const querySchema = z.object({
      query: z.string().describe("Read-only SQL query without backticks"),
    });
    const structuredLLM = llm.withStructuredOutput(querySchema);
    this.queryGeneratorChain = promptTemplate.pipe(structuredLLM);
  }

  async generateQuery(input: string): Promise<string> {
    const schema = await getDatabaseSchema();
    const { query } = await this.queryGeneratorChain.invoke({
      question: input,
      schema,
    });
    return query;
  }
}
