import { llm } from "@/agent/llm";
import { IntentClassifierChain } from "./intent-classification.chain";
import { StandaloneQuestionChain } from "./standalone-question.chain";

const intentClassifierChain = new IntentClassifierChain(llm);
const standaloneQuestionChain = new StandaloneQuestionChain(llm);

export { intentClassifierChain, standaloneQuestionChain };
