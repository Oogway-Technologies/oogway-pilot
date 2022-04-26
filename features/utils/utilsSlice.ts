import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState: {
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
    decisionEngineOptionTab: number
    decisionEngineBestOption: string | undefined
} = {
    fileSizeTooLarge: false,
    feedState: 'All',
    compareForm: {
        comparePostType: 'textOnly',
        compareFormExpanded: false,
        textCompareLeft: '',
        textCompareRight: '',
        labelCompareLeft: '',
        labelCompareRight: '',
        imageCompareLeft: null,
        imageCompareRight: null,
        hasPreviewedCompare: false,
        leftPreviewImage: '',
        rightPreviewImage: '',
        imageToPost: null,
    },
    notificationsState: false,
    jumpToCommentId: '',
    decisionEngineOptionTab: 0,
    decisionEngineBestOption: undefined,
}

export const utilsSlice = createSlice({
    name: 'utils',
    initialState,
    reducers: {
        setImageToPost: (state, { payload }) => {
            state.compareForm.imageToPost = payload
        },
        resetCompareForm: state => {
            state.compareForm = {
                comparePostType: 'textOnly',
                compareFormExpanded: false,
                textCompareLeft: '',
                textCompareRight: '',
                labelCompareLeft: '',
                labelCompareRight: '',
                imageCompareLeft: null,
                imageCompareRight: null,
                hasPreviewedCompare: false,
                leftPreviewImage: '',
                rightPreviewImage: '',
                imageToPost: null,
            }
        },
        setNotificationsState: (state, { payload }: PayloadAction<boolean>) => {
            state.notificationsState = payload
        },
        setFileSizeTooLarge: (state, { payload }: PayloadAction<boolean>) => {
            state.fileSizeTooLarge = payload
        },
        setFeedState: (state, { payload }: PayloadAction<string>) => {
            state.feedState = payload
        },
        // compare form states
        setLeftPreviewImage: (state, { payload }: PayloadAction<string>) => {
            state.compareForm.leftPreviewImage = payload
        },
        setRightPreviewImage: (state, { payload }: PayloadAction<string>) => {
            state.compareForm.rightPreviewImage = payload
        },
        setHasPreviewedCompare: (
            state,
            { payload }: PayloadAction<boolean>
        ) => {
            state.compareForm.hasPreviewedCompare = payload
        },
        setImageCompareLeft: (
            state,
            { payload }: PayloadAction<string | ArrayBuffer | null | undefined>
        ) => {
            state.compareForm.imageCompareLeft = payload
        },
        setImageCompareRight: (
            state,
            { payload }: PayloadAction<string | ArrayBuffer | null | undefined>
        ) => {
            state.compareForm.imageCompareRight = payload
        },
        setComparePostType: (state, { payload }: PayloadAction<string>) => {
            state.compareForm.comparePostType = payload
        },
        setCompareFormExpanded: (
            state,
            { payload }: PayloadAction<boolean>
        ) => {
            state.compareForm.compareFormExpanded = payload
        },
        setTextCompareLeft: (state, { payload }: PayloadAction<string>) => {
            state.compareForm.textCompareLeft = payload
        },
        setTextCompareRight: (state, { payload }: PayloadAction<string>) => {
            state.compareForm.textCompareRight = payload
        },
        setLabelCompareLeft: (state, { payload }: PayloadAction<string>) => {
            state.compareForm.labelCompareLeft = payload
        },
        setLabelCompareRight: (state, { payload }: PayloadAction<string>) => {
            state.compareForm.labelCompareRight = payload
        },
        setJumpToComment: (state, { payload }: PayloadAction<string>) => {
            state.jumpToCommentId = payload
        },
        setDecisionEngineOptionTab: (
            state,
            { payload }: PayloadAction<number>
        ) => {
            state.decisionEngineOptionTab = payload
        },
        setDecisionEngineBestOption: (
            state,
            { payload }: PayloadAction<string>
        ) => {
            state.decisionEngineBestOption = payload
        },
    },
})

export const {
    setLeftPreviewImage,
    setRightPreviewImage,
    setHasPreviewedCompare,
    setImageCompareRight,
    setImageCompareLeft,
    setFileSizeTooLarge,
    setFeedState,
    setComparePostType,
    setLabelCompareRight,
    setLabelCompareLeft,
    setTextCompareRight,
    setTextCompareLeft,
    setCompareFormExpanded,
    setNotificationsState,
    resetCompareForm,
    setJumpToComment,
    setImageToPost,
    setDecisionEngineOptionTab,
    setDecisionEngineBestOption,
} = utilsSlice.actions

export default utilsSlice.reducer
