import type { BaseChatModel } from "@langchain/core/language_models/chat_models";

export interface IIntentClassifier {
  classify(input: string): Promise<"statistical" | "conversational">;
}
