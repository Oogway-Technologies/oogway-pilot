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
}

export interface DecisionForm {
    question: string
    context: string
    options: Options[]
    criteria: Criteria[]
    ratings: [
        {
            option: string
            score: string
            rating: [{ criteria: string; value: number; weight: number }]
        }
    ]
}

export interface Options {
    name: string
    isAI: boolean
}
export interface Criteria {
    name: string
    weight: number
    isAI: boolean
}
