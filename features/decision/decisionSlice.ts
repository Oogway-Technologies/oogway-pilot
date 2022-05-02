import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { AISuggestions } from '../../utils/types/global'
import { DecisionSliceStates } from '../interfaces'

const initialState: DecisionSliceStates = {
    decisionEngineOptionTab: 0,
    decisionEngineBestOption: undefined,
    decisionRatingUpdate: true,
    suggestions: {
        optionsList: [],
        criteriaList: [],
    },
}

export const decisionSlice = createSlice({
    name: 'decision',
    initialState,
    reducers: {
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
            state.suggestions.optionsList = payload.options
                .split(', ')
                .map(item => {
                    return { name: item, isAI: true }
                })
            const commonCriteria = payload.common_criteria
                .split(', ')
                .map(item => {
                    return { name: item, weight: 1, isAI: true }
                })
            const contextCriteria = payload.context_criteria
                .split(', ')
                .map(item => {
                    return { name: item, weight: 3, isAI: true }
                })
            state.suggestions.criteriaList = [
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
} = decisionSlice.actions

export default decisionSlice.reducer
