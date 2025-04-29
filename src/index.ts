import { insightGenerator } from "./agent/pipelines";
import { llm } from "./agent";
import { intentClassifierChain } from "./agent/chains";
import { SYSTEM_PROMPT } from "./agent/prompts";

const input = "list the users who have regisetered their smtp servers";
const intent = await intentClassifierChain.classify(input);

const response =
  intent === "statistical"
    ? await insightGenerator.run(input)
    : await llm.invoke([
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: input },
      ]);

console.log(response.content);
