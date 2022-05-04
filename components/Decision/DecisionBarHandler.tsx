import { useUser } from '@auth0/nextjs-auth0'
import { UilArrowLeft, UilArrowRight } from '@iconscout/react-unicons'
import { FC } from 'react'
import { useFormContext } from 'react-hook-form'

import {
    populateSuggestions,
    setDecisionRatingUpdate,
    updateFormCopy,
} from '../../features/decision/decisionSlice'
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux'
import { squareButton } from '../../styles/decision'
import { warningTime } from '../../utils/constants/global'
import { deepCopy, fetcher, objectsEqual } from '../../utils/helpers/common'
import { AISuggestions } from '../../utils/types/global'
import { ProgressBar } from '../Utils/common/ProgressBar'
import { DecisionSideBarOptions } from './DecisionSideBar'

interface DecisionBarHandlerProps {
    className?: string
    selectedTab: number
    setSelectedTab: (v: number) => void
}

export const DecisionBarHandler: FC<DecisionBarHandlerProps> = ({
    className,
    selectedTab,
    setSelectedTab,
}: DecisionBarHandlerProps) => {
    const {
        trigger,
        clearErrors,
        formState: { errors },
        getValues,
    } = useFormContext()
    const { user } = useUser()
    const decisionRatingUpdate = useAppSelector(
        state => state.decisionSlice.decisionRatingUpdate
    )
    const formCopy = useAppSelector(state => state.decisionSlice.formCopy)

    const loadSuggestions = async () => {
        const question = getValues('question').replaceAll(' ', '%20')
        const context = getValues('context').replaceAll(' ', '%20')
        const data: AISuggestions = await fetcher(
            `/api/getAISuggestions?question=${question}&context=${context}`
        )
        useAppDispatch(populateSuggestions(data))
    }

    const validationHandler = async (tab: number) => {
        console.log('errors: ', errors)
        console.log('Values: ', getValues())

        if (tab === 1) {
            await trigger(['question', 'context'])
            if (errors?.['question']?.message || errors?.['context']?.message) {
                setTimeout(
                    () => clearErrors(['question', 'context']),
                    warningTime
                )
                return false
            }
            if (
                formCopy.question !== getValues('question') ||
                formCopy.context !== getValues('context')
            ) {
                if (user) {
                    loadSuggestions()
                }
                useAppDispatch(
                    updateFormCopy(
                        deepCopy({
                            ...formCopy,
                            question: getValues('question'),
                            context: getValues('context'),
                        })
                    )
                )
            }
        }
        if (tab === 2) {
            await trigger(['options'])
            if (errors?.options && errors?.options.length) {
                setTimeout(() => clearErrors(['options']), warningTime)
                return false
            }
            if (!objectsEqual(formCopy.options, getValues('options'))) {
                if (!decisionRatingUpdate) {
                    useAppDispatch(setDecisionRatingUpdate(true))
                }
                useAppDispatch(
                    updateFormCopy(
                        deepCopy({
                            ...formCopy,
                            options: [...getValues('options')],
                        })
                    )
                )
            }
        }
        if (tab === 3) {
            await trigger(['criteria'])
            if (errors?.criteria && errors?.criteria.length) {
                setTimeout(() => clearErrors(['criteria']), warningTime)
                return false
            }
            if (!objectsEqual(formCopy.criteria, getValues('criteria'))) {
                if (!decisionRatingUpdate) {
                    useAppDispatch(setDecisionRatingUpdate(true))
                }
                useAppDispatch(
                    updateFormCopy(
                        deepCopy({
                            ...formCopy,
                            criteria: [...getValues('criteria')],
                        })
                    )
                )
            }
        }
        return true
    }

    const handleForward = async () => {
        const isValid = await validationHandler(selectedTab)
        if (selectedTab !== DecisionSideBarOptions.length && isValid) {
            setSelectedTab(selectedTab + 1)
        }
    }

    return (
        <div
            className={`flex items-center justify-between ${
                className ? className : ''
            }`}
        >
            <button
                className={`${squareButton} mr-auto`}
                type="button"
                onClick={() => {
                    if (selectedTab !== 1) {
                        setSelectedTab(selectedTab - 1)
                    }
                }}
            >
                <UilArrowLeft className="fill-neutral-700  dark:fill-neutralDark-150" />
            </button>
            <div className="w-3/6">
                <ProgressBar
                    currentStep={selectedTab}
                    totalSteps={DecisionSideBarOptions.length}
                    className="w-full"
                />
            </div>
            <button
                className={`${squareButton} ml-auto`}
                type="button"
                onClick={handleForward}
            >
                <UilArrowRight className="fill-neutral-700 dark:fill-neutralDark-150" />
            </button>
        </div>
    )
}
