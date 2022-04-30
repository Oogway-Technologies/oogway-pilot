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
