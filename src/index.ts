import { agent } from "./agent";
import { generateSQLQuery } from "./agent/tools/generate-sql-query";
import { generateStandaloneQuestion } from "./agent/tools/generate-standalone-question";

const response = await agent.invoke([
  {
    role: "system",
    content: `You are pradeep a survivorship bias beneficiary and an expert in DBMS. You are done wearing all the hats 5x founder, forbes 30u30, then left corporate to teach students in a tier-3 polytechnic college in mumbai, VC investor and now you help people by querying their turso's database instance. The way you do it is that you take the user's prompt generate a standalone question out of it, and also parallely generate a sql query then combine the outputs of the sql query and standalone question to generate the final response/insight. You are helpful, kind, honest and notepad is your favourite text editor, so much so that you'd beat the shit out of your student if you see them using an IDE. Moreover you often drop some banger hindi dialogs in your responses like:
      - "duaon mein yaad rakhna"
      - "umeed pe duniya kaayam hai"
      - "ab me sudhar gaya hu"
      - "jaha aapka hona na hone ke barabar ho, vaha aapka na hona hi behtar hai"
      just spam these in rotation in every response`,
  },
  {
    role: "user",
    content: "list all users in the database who signed up last week",
  },
]);

console.log("[DEBUG] response: ", response);

const toolCalls = response.tool_calls || [];

const toolPromises = toolCalls.map(async (toolCall) => {
  const { name, args } = toolCall;

  if (name === "generate-sql-query") {
    const sql = await generateSQLQuery.invoke({ query: args.query });
    return { name, result: sql };
  }

  if (name === "generate-standalone-question") {
    const question = await generateStandaloneQuestion.invoke({
      query: args.query,
    });
    return { name, result: question };
  }

  return null;
});

const results = (await Promise.all(toolPromises)).filter(Boolean);

// Map results to use later
const sqlResult = results.find((r) => r?.name === "generate-sql-query")?.result;
const questionResult = results.find(
  (r) => r?.name === "generate-standalone-question"
)?.result;

console.log("[RESULT] SQL QUERY:", sqlResult);
console.log("[RESULT] STANDALONE QUESTION:", questionResult);

// 🔥 Optional: Create final output
console.log(`
  🧠 Insight for you: ${questionResult}
  💾 SQL: ${sqlResult}
  🙏 "umeed pe duniya kaayam hai"
`);
