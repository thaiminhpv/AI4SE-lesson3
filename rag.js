import { ChatTogetherAI } from "@langchain/community/chat_models/togetherai";

const llm = new ChatTogetherAI({
    model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
});

import { TogetherAIEmbeddings } from "@langchain/community/embeddings/togetherai";

const embeddings = new TogetherAIEmbeddings({
    model: "togethercomputer/m2-bert-80M-8k-retrieval",
});

// import "cheerio";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
// import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";
import { pull } from "langchain/hub";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";

const loader = new CheerioWebBaseLoader(
    "https://lilianweng.github.io/posts/2023-06-23-agent/"
);

const docs = await loader.load();

console.log(docs);
console.log("----");

const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
});
const splits = await textSplitter.splitDocuments(docs);
const vectorStore = await MemoryVectorStore.fromDocuments(
    splits,
    embeddings
);

// Retrieve and generate using the relevant snippets of the blog.
const retriever = vectorStore.asRetriever();
// const prompt = await pull<ChatPromptTemplate>("rlm/rag-prompt");
const prompt = ChatPromptTemplate.fromMessages([
    ["human", `
You are an assistant for question-answering tasks. Use the following pieces of retrieved context to answer the question. If you don't know the answer, just say that you don't know. Use three sentences maximum and keep the answer concise.

Question: {question} 

Context: {context} 

Answer:
`],
]);

const ragChain = await createStuffDocumentsChain({
    llm,
    prompt,
    outputParser: new StringOutputParser(),
});

const retrievedDocs = await retriever.invoke("what is task decomposition");

let output = await ragChain.invoke({
    question: "What is task decomposition?",
    context: retrievedDocs,
});

console.log(output);