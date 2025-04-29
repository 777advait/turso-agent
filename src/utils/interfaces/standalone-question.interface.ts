import type { BaseChatModel } from "@langchain/core/language_models/chat_models";
import type { MessageContent } from "@langchain/core/messages";

export interface IStandaloneQuestion {
  generateStandaloneQuestion(input: string): Promise<MessageContent>;
}
