import { insightGenerator } from "./agent/pipelines";
import { llm } from "./agent";
import { intentClassifierChain } from "./agent/chains";
import { SYSTEM_PROMPT } from "./agent/prompts";

const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("Welcome to Rem (The Turso Agent)!\n");

function main() {
  readline.question(">>> ", async (input: string) => {
    if (input.toLowerCase() === "exit") {
      console.log("Goodbye!");
      readline.close();
      return;
    }

    const intent = await intentClassifierChain.classify(input);
    const response =
      intent === "statistical"
        ? await insightGenerator.run(input)
        : await llm.invoke([
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: input },
          ]);

    console.log(response.content);
    main(); // Loop for continuous interaction
  });
}

main();
