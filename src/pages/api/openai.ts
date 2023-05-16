import {
  Configuration,
  OpenAIApi,
  CreateCompletionResponse,
  ChatCompletionResponseMessage,
} from "openai";

const config = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

export interface GenerateContentOptions {
  message: string;
  context: string;
  maxTokens?: number;
  temperature?: number;
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
): Promise<string | undefined> => {
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: options.context },
      { role: "user", content: options.message },
    ],
    temperature: options.temperature,
    max_tokens: options.maxTokens,
  });

  return response.data.choices[0].message?.content;
};

export const generateGPT4Content = async (
  options: GenerateContentOptions
): Promise<string | undefined> => {
  const response = await openai.createChatCompletion({
    model: "gpt-4",
    messages: [
      { role: "system", content: options.context },
      { role: "user", content: options.message },
    ],
    temperature: options.temperature,
    max_tokens: options.maxTokens,
  });

  return response.data.choices[0].message?.content;
};

// TODO: Add different generateContent options, as well as an option to save some sort of history
// of the generated content to continue a conversation regarding it.
// maybe a premium service gets access to GPT-4 API calls
