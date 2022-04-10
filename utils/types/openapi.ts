import { FieldValue } from 'firebase/firestore'

type hyperparams = {
    engine: string
    temperature: number
    max_tokens: number
    top_p: number
    stop?: string
    frequency_penalty?: number
    presence_penalty?: number
    logprobs?: number
}

export interface OpenAPICall {
    id?: string
    postMessage: string
    postDescription?: string
    postId: string | undefined
    authorId: string
    feed: string | undefined // handle back-compat with  posts prior to feed feature
    completionPrompt: string
    completionHyperparams: hyperparams
    completionResponse: string | undefined
    filterPrompt: string
    filterResponse: string
    filterLogprobs?: object
    timestamp: FieldValue
}
