import { PromptTemplate } from "@langchain/core/prompts";
import { CLASSIFIER_PROMPT } from "../prompts";
import { z } from "zod";
import type { IIntentClassifier } from "@/utils/interfaces/intent-classifier.inteface";
import type { BaseChatModel } from "@langchain/core/language_models/chat_models";

export class IntentClassifierChain implements IIntentClassifier {
  private intentClassifierChain;

  constructor(llm: BaseChatModel) {
    const promptTemplate = PromptTemplate.fromTemplate(CLASSIFIER_PROMPT);
    const classifierSchema = z.object({
      intent: z
        .enum(["statistical", "conversational"])
        .describe("Intent of the user's input"),
    });
    const structuredLLM = llm.withStructuredOutput(classifierSchema);
    this.intentClassifierChain = promptTemplate.pipe(structuredLLM);
  }

  async classify(input: string): Promise<"statistical" | "conversational"> {
    const { intent } = await this.intentClassifierChain.invoke({ input });
    return intent;
  }
}
