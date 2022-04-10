import { Configuration, OpenAIApi } from 'openai'

// Configure client
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
})
const OpenAI = new OpenAIApi(configuration)

export default OpenAI
