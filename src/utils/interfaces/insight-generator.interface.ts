import type { AIMessageChunk } from "@langchain/core/messages";

export interface IInsightGenerator {
  run(input: string): Promise<AIMessageChunk>;
}
