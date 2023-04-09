import { Configuration, OpenAIApi, CreateCompletionResponse } from "openai";

const config = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

export interface GenerateContentOptions {
  prompt: string;
  maxTokens?: number;
  n?: number;
  stop?: string | string[];
  temperature?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
}

export interface GeneratedContent {
  id: string;
  object: string;
  created: number;
  model: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  choices: {
    text: string;
    index: number;
    logprobs: null;
    finish_reason: string;
  }[];
}

export const generateContent = async (
  options: GenerateContentOptions
): Promise<CreateCompletionResponse> => {
  console.log("Prompt:", options.prompt);
  console.log("Options:", options);

  const response = await openai.createCompletion({
    ...options,
    model: "text-davinci-003",
  });
  return response.data;
};
