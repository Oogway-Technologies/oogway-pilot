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

export interface PostTimeStamp {
    id: string
    timestamp: number
}

// Controls the compare form options flow
export type compareFormOptions = 'chooseType' | 'textOnly' | 'imageOnly'

export type compareFilePickerRefs = {
    left: React.RefObject<HTMLInputElement>
    right: React.RefObject<HTMLInputElement>
}
