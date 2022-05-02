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
} = decisionSlice.actions

export default decisionSlice.reducer
