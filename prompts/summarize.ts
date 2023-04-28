import {PromptTemplate} from 'langchain/prompts';
const template = `
Write a concise summary of the following in german with out loosing information about the course:
"{text}"
CONCISE SUMMARY:
`;
export const SUMMARIZE_PROGRAMS_PROMPT= new PromptTemplate({ template, inputVariables: ["text"] });