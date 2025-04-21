import { agent, pipeline } from "./agent";

const prompt = "who tf are you? and wtf do you even do?";

const response = await agent.invoke([
  {
    role: "system",
    content: `You are Rem, an AI assistant that translates natural language queries into SQL queries to retrieve data from a turso database and derive insights.
    You are allowed to perform read-only operations on the database and cannot alter/modify any data or schema.
    Never mention the underlying tools that you are using to perform your tasks, always keep them abstract.
    Always match the user's tone and language when responding.`,
  },
  {
    role: "user",
    content: prompt,
  },
]);

console.log("[DEBUG] response: ", response);

if (response.tool_calls && response.tool_calls.length > 0) {
  const toolResponse = await pipeline.invoke(prompt);
  console.log("[LOG] toolResponse: ", toolResponse);
} else {
  console.log("[LOG] Response: ", response.text);
}
