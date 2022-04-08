import { FieldValue } from 'firebase/firestore'

type hyperparams = {
    temperature: number
    max_tokens: number
    top_p: number
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
    completionEngine: string
    completionPrompt: string
    completionHyperparams: hyperparams
    completionResponse: string | undefined
    filterEngine: string
    filterPrompt: string
    filterHyperparams: hyperparams
    filterResponse: string
    filterLogprobs: object
    timestamp: FieldValue
}
