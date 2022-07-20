import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { capitalize } from '../../utils/helpers/common'
import { FirebaseDecisionActivity } from '../../utils/types/firebase'
import { AISuggestions, Criteria, Options } from '../../utils/types/global'
import { DecisionSliceStates, FormCopy, InfoModalDetails } from '../interfaces'

const initialState: DecisionSliceStates = {
    currentTab: 0,
    matrixStep: 0,
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
    isInfoModal: false,
    infoModalDetails: {
        title: '',
        context: '',
    },
    decisionCriteriaQueryKey: undefined,
    decisionActivityId: undefined,
    decisionQuestion: undefined,
    userExceedsMaxDecisions: false,
    criteriaMobileIndex: 0,
    sideCardStep: 1,
    clickedConnect: false,
    decisionFormState: {},
    isDecisionRehydrated: false,
    isThereATie: false,
    isQuestionSafeForAI: true,
    userIgnoredUnsafeWarning: false,
    decisionMatrixHasResults: true,
    decisionHistoryModal: false,
}

export const decisionSlice = createSlice({
    name: 'decision',
    initialState,
    reducers: {
        setDecisionHistoryModal: (
            state,
            { payload }: PayloadAction<boolean>
        ) => {
            state.decisionHistoryModal = payload
        },
        handleResetState: state => {
            state.currentTab = 0
            state.matrixStep = 0
            state.decisionQuestion = undefined
            state.decisionActivityId = undefined
            state.sideCardStep = 1
            state.clickedConnect = false
            state.decisionFormState = {}
            state.isDecisionRehydrated = false
            state.isQuestionSafeForAI = true
            state.userIgnoredUnsafeWarning = false
        },
        setInfoModalDetails: (
            state,
            { payload }: PayloadAction<InfoModalDetails>
        ) => {
            state.infoModalDetails = payload
        },
        setInfoModal: (state, { payload }: PayloadAction<boolean>) => {
            state.isInfoModal = payload
        },
        setIsThereATie: (state, { payload }: PayloadAction<boolean>) => {
            state.isThereATie = payload
        },
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
            {
                payload: { data, optionsList, criteriaList },
            }: PayloadAction<{
                data: AISuggestions
                optionsList: Options[]
                criteriaList: Criteria[]
            }>
        ) => {
            const options = data.options?.map(item => {
                return { name: capitalize(item), isAI: true }
            })
            state.suggestions.copyOptionsList = options
            if (optionsList.length > 1) {
                optionsList.forEach(firstObj => {
                    options.forEach((compareObj, i) => {
                        if (firstObj.name === compareObj.name) {
                            options.splice(i, 1)
                        }
                    })
                })
            }
            state.suggestions.optionsList = options

            const commonCriteria = data.common_criteria?.map(item => {
                return { name: capitalize(item), weight: 1, isAI: true }
            })
            const contextCriteria = data.context_criteria.map(item => {
                return { name: capitalize(item), weight: 3, isAI: true }
            })
            const aiCriteria = [...contextCriteria, ...commonCriteria]
            state.suggestions.copyCriteriaList = aiCriteria

            if (criteriaList.length > 1) {
                criteriaList.forEach(firstObj => {
                    aiCriteria.forEach((compareObj, i) => {
                        if (firstObj.name === compareObj.name) {
                            aiCriteria.splice(i, 1)
                        }
                    })
                })
            }
            state.suggestions.criteriaList = aiCriteria
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
        updateDecisionFormState: (
            state,
            { payload }: PayloadAction<FirebaseDecisionActivity>
        ) => {
            state.decisionFormState = {
                ...state.decisionFormState,
                ...payload,
            }
        },
        setDecisionFormState: (
            state,
            { payload }: PayloadAction<FirebaseDecisionActivity>
        ) => {
            state.decisionFormState = payload
        },
        setIsDecisionRehydrated: (
            state,
            { payload }: PayloadAction<boolean>
        ) => {
            state.isDecisionRehydrated = payload
        },
        setIsQuestionSafeForAI: (
            state,
            { payload }: PayloadAction<boolean>
        ) => {
            state.isQuestionSafeForAI = payload
        },
        setUserIgnoredUnsafeWarning: (
            state,
            { payload }: PayloadAction<boolean>
        ) => {
            state.userIgnoredUnsafeWarning = payload
        },
        setDecisionMatrixHasResults: (
            state,
            { payload }: PayloadAction<boolean>
        ) => {
            state.decisionMatrixHasResults = payload
        },
        setCurrentTab: (state, { payload }: PayloadAction<number>) => {
            state.currentTab = payload
        },
        setMatrixStep: (state, { payload }: PayloadAction<number>) => {
            state.matrixStep = payload
        },
    },
})

export const {
    handleResetState,
    setCurrentTab,
    setMatrixStep,
    setInfoModal,
    setInfoModalDetails,
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
    setDecisionFormState,
    updateDecisionFormState,
    setIsDecisionRehydrated,
    setIsThereATie,
    setIsQuestionSafeForAI,
    setUserIgnoredUnsafeWarning,
    setDecisionMatrixHasResults,
    setDecisionHistoryModal,
} = decisionSlice.actions

export default decisionSlice.reducer
