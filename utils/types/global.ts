import { decisionRating } from './firebase'

export type jsonTimeObj = {
    seconds: number
    nanoseconds: number
}

export interface EngagementItems {
    icon: JSX.Element
    text: string
    onClick: any
    expanded?: any
}

export interface MediaObject {
    text: string
    image: string
    label?: string
    previewImage: string
}

export interface HTMLInputEvent extends Event {
    target: HTMLInputElement & EventTarget
}

export interface APITimeStamp {
    id: string
    timestamp: number
}

// Controls the compare form options flow
export type compareFormOptions = 'chooseType' | 'textOnly' | 'imageOnly'

export type compareFilePickerRefs = {
    left: React.RefObject<HTMLInputElement>
    right: React.RefObject<HTMLInputElement>
}

export interface TruncateTextProps {
    input: string
    maxLength: number
    bufferLength: number
}

export interface AISuggestions {
    options: string[]
    context_criteria: string[]
    common_criteria: string[]
    content: string[]
    is_safe: boolean
}

export interface DecisionForm {
    [index: string]:
        | string
        | Options[]
        | Criteria[]
        | decisionRating[]
        | boolean
        | undefined
    ipAddress: string
    userId: string
    isComplete: boolean
    question: string
    context: string
    options?: Options[]
    criteria?: Criteria[]
    ratings?: decisionRating[]
    clickedConnect?: boolean
}

export type decisionFormFields =
    | 'question'
    | 'context'
    | 'options'
    | 'criteria'
    | 'ratings'
export interface Options {
    name: string
    isAI: boolean
    score?: number
}
export interface Criteria {
    name: string
    weight: number
    isAI: boolean
}

export interface Rating {
    criteria: string
    value: number
    weight: number
}

export interface Ratings {
    option: string
    rating: Rating[]
}

export interface TabItem {
    title: string
    tab: number
}
export type Tab = { name: string; weight: number }

export interface IV {
    index: number
    value: string
}

export interface MatrixRating {
    columns: string[]
    index: number[]
    data: any[][]
}

export interface MatrixObject {
    decision: string
    context: string
    recommendation: string
    ratings: MatrixRating
    weights: MatrixRating
}

export interface Heap {
    track: (event: string, properties?: object) => void
    identify: (identity: string) => void
    resetIdentity: () => void
    addUserProperties: (properties: object) => void
    addEventProperties: (properties: object) => void
    removeEventProperty: (property: string) => void
    clearEventProperties: () => void
    appid: string
    userId: string
    identity: string | null
    config: any
}
