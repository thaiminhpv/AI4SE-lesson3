import { ChatTogetherAI } from "@langchain/community/chat_models/togetherai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const model = new ChatTogetherAI({
    model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
});

const messages = [
    { role: "system", text: "Translate the following from English into Italian" },
    { role: "user", text: "hi!" },
];

console.log(await model.invoke(messages));

// ----
console.log("----");

const promptTemplate = ChatPromptTemplate.fromMessages([
    ["system", "Translate the following into {language}:"],
    ["user", "{text}"],
]);

const parser = new StringOutputParser();

const llmChain = (
    promptTemplate
    .pipe(model)
    .pipe(parser)
);

console.log(
    await llmChain.invoke({ language: "italian", text: "hi" })
);