import { OpenAI } from 'langchain/llms/openai'
import { Chroma } from 'langchain/vectorstores/chroma'
import {
    ConversationalRetrievalQAChain
} from 'langchain/chains'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { QA_TEMPLATE, PROMPT_GENERATOR_TEMPLATE } from '~/prompts/recommend'

export default defineEventHandler(async (event) => {
    const { history, question, fieldOfInterest } = await readBody(event);
    const model = new OpenAI({ maxTokens: 200, modelName: "gpt-3.5-turbo" });
    const vectorStore = await Chroma.fromExistingCollection(
        new OpenAIEmbeddings(),
        { 
            collectionName: 'programs' 
        }
    )
    const chain = ConversationalRetrievalQAChain.fromLLM(
        model,
        vectorStore.asRetriever(),
        {
            qaTemplate: QA_TEMPLATE,
            questionGeneratorTemplate: PROMPT_GENERATOR_TEMPLATE,
            returnSourceDocuments: true,
        }
    )
    const response = await chain.call({
        question: question.trim(),
        chat_history: history,
    })
    await Promise.all([
        response
    ])

    return { result: response };
})