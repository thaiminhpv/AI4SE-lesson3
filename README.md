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
    import { RAG } from "@langchain/community/llms/rag";

    const model = new RAG({
        model: "facebook/rag-token-nq",
    });

    import { HumanMessage, SystemMessage } from "@langchain/core/messages";

    const messages = [
        new SystemMessage("Translate the following from English into Italian"),
        new HumanMessage("hi!"),
    ];

    console.log(await model.invoke(messages));
    ```
