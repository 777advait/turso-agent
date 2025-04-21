import { PromptTemplate } from "@langchain/core/prompts";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { llm } from "../index";

async function generateStandaloneQuestion({
  question,
}: {
  question: string;
}): Promise<string> {
  const standaloneQuestionTemplate = `Given a natural language prompt, convert it to a standalone question.
    Question: {question}
    
    Standalone question:`;

  const standaloneQuestion = PromptTemplate.fromTemplate(
    standaloneQuestionTemplate
  );

  const standaloneQuestionChain = standaloneQuestion.pipe(llm);

  const result = await standaloneQuestionChain.invoke({ question });

  return result.text;
}

const standaloneQuestionTool = tool(
  async ({ question }: { question: string }) =>
    await generateStandaloneQuestion({ question }),
  {
    name: "standalone-question-tool",
    description:
      "generates a standalone question from natural language prompt related to data, insights or sql",
    schema: z.object({
      question: z
        .string()
        .describe(
          "a natural language prompt to generate a standalone question from"
        ),
    }),
  }
);

export { standaloneQuestionTool };
