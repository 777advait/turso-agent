import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { tools } from "./tools";
import { env } from "@/env";
import { RunnableSequence } from "@langchain/core/runnables";
import { standaloneQuestionTool } from "./tools/standalone-question.tool";

const llm = new ChatGoogleGenerativeAI({
  apiKey: env.GOOGLE_GEMINI_API_KEY,
  model: "gemini-2.0-flash",
  temperature: 0.7,
});

const agent = llm.bindTools(tools);

const pipeline = RunnableSequence.from([
  async (question: string) => {
    const standaloneQuestion = await standaloneQuestionTool.invoke({ question });

    return standaloneQuestion as string;
  },
  async (result: string) => {
    return result;
  },
]);

export { llm, agent, pipeline };
