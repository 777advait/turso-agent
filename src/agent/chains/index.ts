import { llm } from "@/agent";
import { IntentClassifierChain } from "./intent-classification.chain";
import { StandaloneQuestionChain } from "./standalone-question.chain";
import { QueryGeneratorChain } from "./query-generator.chain";

const intentClassifierChain = new IntentClassifierChain(llm);
const standaloneQuestionChain = new StandaloneQuestionChain(llm);
const queryGeneratorChain = new QueryGeneratorChain(llm);

export { intentClassifierChain, standaloneQuestionChain, queryGeneratorChain };
