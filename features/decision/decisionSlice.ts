import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { capitalize } from '../../utils/helpers/common'
import { AISuggestions } from '../../utils/types/global'
import { DecisionSliceStates, FormCopy } from '../interfaces'

const initialState: DecisionSliceStates = {
    decisionEngineOptionTab: 0,
    decisionEngineBestOption: undefined,
    decisionRatingUpdate: true,
    loadingAiSuggestions: false,
    isSuggestionsEmpty: false,
    previousIndex: 1,
    ratingTabChecker: [],
    suggestions: {
        optionsList: [],
        criteriaList: [],
        copyOptionsList: [],
        copyCriteriaList: [],
    },
    formCopy: {
        question: '',
        context: '',
        options: [],
        criteria: [],
    },
    decisionCriteriaQueryKey: undefined,
    decisionActivityId: undefined,
    decisionQuestion: undefined,
    userExceedsMaxDecisions: false,
    criteriaMobileIndex: 0,
    sideCardStep: 1,
    clickedConnect: false,
}

export const decisionSlice = createSlice({
    name: 'decision',
    initialState,
    reducers: {
        setSideCardStep: (state, { payload }: PayloadAction<number>) => {
            state.sideCardStep = payload
        },
        setCriteriaMobileIndex: (state, { payload }: PayloadAction<number>) => {
            state.criteriaMobileIndex = payload
        },
        setRatingTabChecker: (state, { payload }: PayloadAction<boolean[]>) => {
            state.ratingTabChecker = payload
        },
        setPreviousIndex: (state, { payload }: PayloadAction<number>) => {
            state.previousIndex = payload
        },
        setIsSuggestionsEmpty: (state, { payload }: PayloadAction<boolean>) => {
            state.isSuggestionsEmpty = payload
        },
        resetSuggestions: state => {
            state.suggestions.criteriaList = []
            state.suggestions.optionsList = []
            state.suggestions.copyCriteriaList = []
            state.suggestions.copyOptionsList = []
        },
        setLoadingAiSuggestions: (
            state,
            { payload }: PayloadAction<boolean>
        ) => {
            state.loadingAiSuggestions = payload
        },
        updateFormCopy: (state, { payload }: PayloadAction<FormCopy>) => {
            state.formCopy = payload
        },
        addSelectedCriteria: (
            state,
            {
                payload,
            }: PayloadAction<{ name: string; weight: number; isAI: boolean }>
        ) => {
            state.suggestions.criteriaList = [
                ...state.suggestions.criteriaList,
                payload,
            ]
        },
        removeSelectedCriteria: (
            state,
            {
                payload,
            }: PayloadAction<{ name: string; weight?: number; isAI: boolean }>
        ) => {
            const filteredArray = state.suggestions.criteriaList.filter(
                item => {
                    if (item.name !== payload.name) {
                        return item
                    }
                }
            )
            state.suggestions.criteriaList = filteredArray
        },
        addSelectedOption: (
            state,
            { payload }: PayloadAction<{ name: string; isAI: boolean }>
        ) => {
            state.suggestions.optionsList = [
                ...state.suggestions.optionsList,
                payload,
            ]
        },
        removeSelectedOption: (
            state,
            { payload }: PayloadAction<{ name: string; isAI: boolean }>
        ) => {
            const filteredArray = state.suggestions.optionsList.filter(item => {
                if (item.name !== payload.name) {
                    return item
                }
            })
            state.suggestions.optionsList = filteredArray
        },
        populateSuggestions: (
            state,
            { payload }: PayloadAction<AISuggestions>
        ) => {
            const options = payload.options.map(item => {
                return { name: capitalize(item), isAI: true }
            })
            state.suggestions.optionsList = options
            state.suggestions.copyOptionsList = options
            const commonCriteria = payload.common_criteria.map(item => {
                return { name: capitalize(item), weight: 2, isAI: true }
            })
            const contextCriteria = payload.context_criteria.map(item => {
                return { name: capitalize(item), weight: 3, isAI: true }
            })
            state.suggestions.criteriaList = [
                ...commonCriteria,
                ...contextCriteria,
            ]
            state.suggestions.copyCriteriaList = [
                ...commonCriteria,
                ...contextCriteria,
            ]
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
        setDecisionRatingUpdate: (
            state,
            { payload }: PayloadAction<boolean>
        ) => {
            state.decisionRatingUpdate = payload
        },
        setDecisionCriteriaQueryKey: (
            state,
            { payload }: PayloadAction<string | undefined>
        ) => {
            state.decisionCriteriaQueryKey = payload
        },
        setDecisionActivityId: (
            state,
            { payload }: PayloadAction<string | undefined>
        ) => {
            state.decisionActivityId = payload
        },
        setDecisionQuestion: (
            state,
            { payload }: PayloadAction<string | undefined>
        ) => {
            state.decisionQuestion = payload
        },
        setUserExceedsMaxDecisions: (
            state,
            { payload }: PayloadAction<boolean>
        ) => {
            state.userExceedsMaxDecisions = payload
        },
        setClickedConnect: (state, { payload }: PayloadAction<boolean>) => {
            state.clickedConnect = payload
        },
    },
})

export const {
    setDecisionEngineOptionTab,
    setDecisionEngineBestOption,
    setDecisionRatingUpdate,
    populateSuggestions,
    addSelectedOption,
    removeSelectedOption,
    addSelectedCriteria,
    removeSelectedCriteria,
    updateFormCopy,
    setLoadingAiSuggestions,
    resetSuggestions,
    setIsSuggestionsEmpty,
    setPreviousIndex,
    setRatingTabChecker,
    setDecisionCriteriaQueryKey,
    setDecisionActivityId,
    setDecisionQuestion,
    setUserExceedsMaxDecisions,
    setCriteriaMobileIndex,
    setSideCardStep,
    setClickedConnect,
} = decisionSlice.actions

export default decisionSlice.reducer
