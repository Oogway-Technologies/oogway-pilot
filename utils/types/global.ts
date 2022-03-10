export interface EngagementItems {
    icon: JSX.Element,
    text: string,
    onClick: any,
    expanded?: any
}

export interface MediaObject{
    text: string,
    image: string,
    previewImage: string
}

export interface HTMLInputEvent extends Event {
    target: HTMLInputElement & EventTarget;
}

export interface PostTimeStamp {
    id:string,
    timestamp:number
}