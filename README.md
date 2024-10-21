# Introduction to LangchainJS

1. Install nodejs

2. Init project

    ```bash
    npm init -y
    ```

    then add the following to the `package.json` file:

    ```json
    "type": "module"
    ```

3. Install langchain

    ```bash
    npm i @langchain/community @langchain/core
    ```

4. Create a new file `index.js` and write the following code:

    ```javascript
    
    import { TogetherAI } from "@langchain/community/llms/togetherai";

    const model = new TogetherAI({
        model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
    });

    const messages = [
        { role: "system", text: "Translate the following from English into Italian" },
        { role: "user", text: "hi!" },
    ];

    console.log(await model.invoke(messages));
    ```

5. Add the API key to the environment variable

    Linux:

    ```bash
    export TOGETHER_AI_API_KEY=...
    ```

    Windows:

    ```bash
    setx TOGETHER_AI_API_KEY ...
    ```

6. Run the code

    ```bash
    node index.js
    ```

## Links

- https://js.langchain.com/docs/tutorials/
- https://js.langchain.com/docs/tutorials/llm_chain/
- https://js.langchain.com/docs/tutorials/chatbot/
- https://js.langchain.com/docs/integrations/chat/togetherai/

# RAG

7. Create the `rag.js` file and write the following code:

    ```javascript
    import { ChatTogetherAI } from "@langchain/community/chat_models/togetherai";

    const llm = new ChatTogetherAI({
        model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
    });

    import { TogetherAIEmbeddings } from "@langchain/community/embeddings/togetherai";

    const embeddings = new TogetherAIEmbeddings({
        model: "togethercomputer/m2-bert-80M-8k-retrieval",
    });

    import "cheerio";
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
    ```

## Links

- https://js.langchain.com/docs/integrations/text_embedding/togetherai/
- https://docs.together.ai/docs/embedding-models
- https://js.langchain.com/docs/tutorials/rag/
