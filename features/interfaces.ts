export interface UtilsSliceStates {
    fileSizeTooLarge: boolean
    feedState: string
    compareForm: {
        comparePostType: string
        compareFormExpanded: boolean
        textCompareLeft: string
        textCompareRight: string
        labelCompareLeft: string
        labelCompareRight: string
        imageCompareLeft: string | ArrayBuffer | null | undefined
        imageCompareRight: string | ArrayBuffer | null | undefined
        hasPreviewedCompare: boolean
        leftPreviewImage: string
        rightPreviewImage: string
        imageToPost: string | ArrayBuffer | null | undefined
    }
    notificationsState: boolean
    jumpToCommentId: string
}

export interface Suggestions {
    optionsList: { name: string; isAI: boolean }[]
    criteriaList: { name: string; weight: number; isAI: boolean }[]
}

export interface DecisionSliceStates {
    decisionEngineOptionTab: number
    decisionEngineBestOption: string | undefined
    decisionRatingUpdate: boolean
    suggestions: Suggestions
}
