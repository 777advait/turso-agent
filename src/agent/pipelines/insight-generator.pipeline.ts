import { RunnableSequence } from "@langchain/core/runnables";
import { standaloneQuestionTool } from "../tools/standalone-question.tool";

export const insightGenerator = RunnableSequence.from([
  async (question: string) => {
    const standaloneQuestion = await standaloneQuestionTool.invoke({
      question,
    });

    return standaloneQuestion as string;
  },
  async (result: string) => {
    return result;
  },
]);
