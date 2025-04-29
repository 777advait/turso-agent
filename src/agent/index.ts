import { tools } from "./tools";
import { llm } from "./llm";

export const agent = llm.bindTools(tools);
