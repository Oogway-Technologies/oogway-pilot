import { UilArrowLeft, UilArrowRight } from '@iconscout/react-unicons'
import { FC } from 'react'
import { useFormContext } from 'react-hook-form'

import { populateSuggestions } from '../../features/decision/decisionSlice'
import { useAppDispatch } from '../../hooks/useRedux'
import { squareButton } from '../../styles/decision'
import { warningTime } from '../../utils/constants/global'
import { fetcher } from '../../utils/helpers/common'
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

    const loadSuggestions = async () => {
        const question = getValues('question').replaceAll(' ', '%20')
        const context = getValues('context').replaceAll(' ', '%20')
        const data: AISuggestions = await fetcher(
            `/api/getAISuggestions?question=${question}&context=${context}`
        )
        useAppDispatch(populateSuggestions(data))
    }

    const validationHandler = async (tab: number) => {
        loadSuggestions()
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
        }
        if (tab === 2) {
            await trigger(['options'])
            if (errors?.options && errors?.options.length) {
                setTimeout(() => clearErrors(['options']), warningTime)
                return false
            }
        }
        if (tab === 3) {
            await trigger(['criteria'])
            if (errors?.criteria && errors?.criteria.length) {
                setTimeout(() => clearErrors(['criteria']), warningTime)
                return false
            }
        }
        return true
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
                onClick={async () => {
                    const isValid = await validationHandler(selectedTab)
                    if (
                        selectedTab !== DecisionSideBarOptions.length &&
                        isValid
                    ) {
                        setSelectedTab(selectedTab + 1)
                    }
                }}
            >
                <UilArrowRight className="fill-neutral-700 dark:fill-neutralDark-150" />
            </button>
        </div>
    )
}
