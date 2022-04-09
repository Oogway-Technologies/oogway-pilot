import { Configuration, OpenAIApi } from 'openai'

// Configure client
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
})
const OpenAI = new OpenAIApi(configuration)

// Model hyperparameters
// Completiion model
const completionEngine: string = process.env.OPENAI_COMPLETION_ENGINE as string
const completionPreprompt: string = process.env
    .OPENAI_COMPLETION_PREPROMPT as string
const completionTemplate = (decision: string, context: string) =>
    `Q: ${decision}\nContext: ${context}\nA:`
const completionHyperparams = {
    temperature: parseInt(process.env.OPENAI_COMPLETION_TEMPERATURE as string),
    max_tokens: parseInt(process.env.OPENAI_COMPLETION_MAX_TOKENS as string),
    top_p: parseInt(process.env.OPENAI_COMPLETION_TOP_P as string),
    frequency_penalty: parseInt(
        process.env.OPENAI_COMPLETION_FREQUENCY_PENALTY as string
    ),
    presence_penalty: parseInt(
        process.env.OPENAI_COMPLETION_PRESENCE_PENALTY as string
    ),
    stop: ['\n'],
}

// Filter model
const filterEngine = process.env.OPENAI_FILTER_ENGINE as string
const filterTemplate = (prompt: string | undefined) =>
    `<|endoftext|>${prompt}\n--\nLabel:`
const filterHyperparams = {
    temperature: parseInt(process.env.OPENAI_FILTER_TEMPERATURE as string),
    max_tokens: parseInt(process.env.OPENAI_FILTER_MAX_TOKENS as string),
    top_p: parseInt(process.env.OPENAI_FILTER_TOP_P as string),
    logprobs: parseInt(process.env.OPENAI_FILTER_LOGPROBS as string),
}

// Exports
export const completionParams = {
    engine: completionEngine,
    preprompt: completionPreprompt,
    template: completionTemplate,
    hyperparams: completionHyperparams,
}

export const filterParams = {
    engine: filterEngine,
    template: filterTemplate,
    hyperparams: filterHyperparams,
}

export default OpenAI
