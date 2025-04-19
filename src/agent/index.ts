import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { tools } from "./tools";
import { env } from "@/env";

export const agent = new ChatGoogleGenerativeAI({
  apiKey: env.GOOGLE_GEMINI_API_KEY,
  model: "gemini-2.0-flash",
}).bindTools(tools);
