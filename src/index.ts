import { insightGenerator } from "./agent/pipelines/insight-generator.pipeline";
import { llm } from "./agent/llm";
import { intentClassifierChain } from "./agent/chains";
import { SYSTEM_PROMPT } from "./agent/prompts";

const input = "Wahts the average age of users?";
const intent = await intentClassifierChain.classify(input);

const response =
  intent === "statistical"
    ? await insightGenerator.invoke(input)
    : await llm.invoke([
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: input },
      ]);

console.log(typeof response === "string" ? response : response.content);
