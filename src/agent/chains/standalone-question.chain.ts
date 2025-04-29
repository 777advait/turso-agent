import type { IStandaloneQuestion } from "@/utils/interfaces/standalone-question.interface";
import { PromptTemplate } from "@langchain/core/prompts";
import { STANDALONE_QUESTION_PROMPT } from "../prompts";
import type { MessageContent } from "@langchain/core/messages";
import type { BaseChatModel } from "@langchain/core/language_models/chat_models";

export class StandaloneQuestionChain implements IStandaloneQuestion {
  private standaloneQuestionChain;

  constructor(llm: BaseChatModel) {
    const promptTemplate = PromptTemplate.fromTemplate(
      STANDALONE_QUESTION_PROMPT
    );
    this.standaloneQuestionChain = promptTemplate.pipe(llm);
  }

  async generateStandaloneQuestion(input: string): Promise<MessageContent> {
    const { content } = await this.standaloneQuestionChain.invoke({
      question: input,
    });
    return content;
  }
}
