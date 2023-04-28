import { OpenAI } from "langchain/llms/openai";
import { loadSummarizationChain } from "langchain/chains";
import { Document } from "langchain/document";
import { SUMMARIZE_PROGRAMS_PROMPT } from "~/prompts/summarize";

type Program = {
    title: string;
    cluster: string;
    pageContent: string;
};
export default defineEventHandler(async (event) => {
    const { offset } = getQuery(event);

    const programs = await $fetch<Program[]>(
        `${process.env.UPSKILLING_CMS_BASE_URL}/api/ai/programs/${offset}/50`
    );
    const programDocs = programs.map(
        (program: Program) =>
            new Document({
                pageContent: program.pageContent,
                metadata: {
                    title: program.title,
                    cluster: program.cluster,
                },
            })
    );

    const docs = await Promise.all(
        programDocs.map(async (programDoc: Document) => {
            const model = new OpenAI({ maxTokens: 200, modelName: "gpt-3.5-turbo", temperature: 0 });
            const chain = loadSummarizationChain(model, {
                prompt: SUMMARIZE_PROGRAMS_PROMPT,
                type: "stuff",
            });
            const summary = await chain.call({
                input_documents: [programDoc],
            });
            return new Document({
                pageContent: summary.text,
                metadata: programDoc.metadata,
            });
        })
    );
    const collection = await Chroma.fromDocuments(docs, new OpenAIEmbeddings(), {
        collectionName: 'programs',
    })
    return { result: collection.numDimensions };
});
