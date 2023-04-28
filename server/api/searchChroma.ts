import { Chroma } from "langchain/vectorstores/chroma";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

export default defineEventHandler(async (event) => {
    const { query } = getQuery(event);
    const vectorstore = await Chroma.fromExistingCollection(new OpenAIEmbeddings(), { collectionName: "programs" });
    const results = await vectorstore.similaritySearch(query as string, 5);
    return results;
});