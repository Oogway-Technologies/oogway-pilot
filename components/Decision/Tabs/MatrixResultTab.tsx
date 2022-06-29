import React, { FC, useEffect, useRef } from 'react'
import { useFormContext } from 'react-hook-form'

import {
    setIsQuestionSafeForAI,
    setUserIgnoredUnsafeWarning,
} from '../../../features/decision/decisionSlice'
import useMediaQuery from '../../../hooks/useMediaQuery'
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import { feedToolbarClass } from '../../../styles/feed'
import { body, bodyHeavy } from '../../../styles/typography'
import { Criteria, Options } from '../../../utils/types/global'
import Button from '../../Utils/Button'
import { ResultChart } from '../common/ResultChart'
import { ResultTable } from '../common/ResultTable'

interface MatrixResultTabProps {
    setMatrixStep: (n: number) => void
    setCurrentTab: (n: number) => void
}
const MatrixResultTab: FC<MatrixResultTabProps> = ({
    setMatrixStep,
    setCurrentTab,
}: MatrixResultTabProps) => {
    const isMobile = useMediaQuery('(max-width: 965px)')
    const scrollRef = useRef<HTMLDivElement>(null)
    const { reset, getValues, setValue } = useFormContext()
    const {
        decisionEngineBestOption,
        isThereATie,
        decisionMatrixHasResults,
        isQuestionSafeForAI,
    } = useAppSelector(state => state.decisionSlice)

    const fixUpStates = () => {
        const orgOptionsList = getValues('options')
        const orgCriteriaList = getValues('criteria')

        const criteriaList = orgCriteriaList.filter(
            (item: Criteria) => item.name
        )
        const optionsList = orgOptionsList.filter((item: Options) => item.name)

        setValue('options', optionsList)
        setValue('criteria', criteriaList)
    }

    useEffect(() => {
        if (decisionMatrixHasResults) fixUpStates()

        setTimeout(
            () =>
                scrollRef.current?.scrollIntoView({
                    block: 'start',
                    behavior: 'smooth',
                }),
            0
        )
    }, [])

    const handleReconsider = () => {
        reset() // reset form state
        useAppDispatch(setIsQuestionSafeForAI(true))
        useAppDispatch(setUserIgnoredUnsafeWarning(false))
        setCurrentTab(0)
        setMatrixStep(0)
    }

    const handleContinue = () => {
        if (!isQuestionSafeForAI) {
            useAppDispatch(setUserIgnoredUnsafeWarning(true))
        }
        setCurrentTab(2)
    }

    return (
        <div className="flex flex-col mb-3 space-y-3">
            {decisionMatrixHasResults ? (
                <>
                    <div className="w-0 h-0" ref={scrollRef} />
                    <ResultChart />
                    <div className="flex flex-col my-4 mb-3 space-y-1 text-center">
                        {isThereATie ? (
                            <>
                                <span
                                    className={`text-center font-bold leading-10 text-neutral-800 text-xl tracking-normal dark:text-white`}
                                >
                                    It’s a tie!
                                </span>
                                <span
                                    className={`${body} text-neutral-700 dark:text-neutralDark-150`}
                                >
                                    We’ve randomly picked{' '}
                                    <b className="text-primary dark:text-primaryDark">
                                        {decisionEngineBestOption}
                                    </b>
                                    .
                                </span>
                                <span
                                    className={`${body} text-neutral-700 dark:text-neutralDark-150`}
                                >
                                    Refine{' '}
                                    <b className="text-primary dark:text-primaryDark">
                                        rating
                                    </b>{' '}
                                    for criteria to get a more accurate result.
                                </span>
                            </>
                        ) : (
                            <>
                                <span
                                    className={`${body} text-neutral-700 dark:text-neutralDark-150`}
                                >
                                    Your best option is
                                </span>
                                <span className="text-3xl font-bold tracking-normal leading-10 text-center text-primary dark:text-primaryDark">
                                    {decisionEngineBestOption}
                                </span>
                            </>
                        )}
                    </div>
                    <ResultTable />
                </>
            ) : (
                <div
                    className={
                        isMobile ? 'flex flex-col-reverse' : 'grid grid-cols-3'
                    }
                >
                    <div></div>
                    <div className="flex flex-col col-span-2 col-start-2 mx-auto">
                        <div
                            className={`flex flex-col gap-y-md
                                ${
                                    isMobile
                                        ? 'my-4'
                                        : 'custom-box-shadow-md dark:custom-box-shadow-dark-md mb-4 mr-4 rounded-2xl rounded-bl-none bg-white py-4 px-3 dark:bg-neutralDark-500'
                                }`}
                        >
                            <span className="mt-4 text-sm font-normal text-left text-neutral-700 dark:text-neutralDark-150">
                                {isQuestionSafeForAI
                                    ? `Oogway cannot help with this
                            decision. It's a work in progress and it's learning
                            to serve better suggestions with each decision you
                            make. You can still continue using our Decision
                            Engine to get a result.`
                                    : `Sorry, this decision violates our policies for content
                        safety and AI cannot provide any information. We
                        recommend you reconsider this decision.`}
                            </span>
                            <div
                                className={`mx-auto flex items-center gap-x-lg`}
                            >
                                <Button
                                    keepText
                                    text="Continue"
                                    className={`w-36 border border-neutral-700 bg-transparent py-2 text-neutral-700 ${bodyHeavy} justify-center rounded dark:border-neutral-150 dark:text-neutral-150`}
                                    onClick={handleContinue}
                                />
                                {!isQuestionSafeForAI && (
                                    <Button
                                        keepText
                                        text="Reconsider"
                                        className={`w-36 border border-primary bg-transparent py-2 text-primary dark:border-primaryDark dark:bg-primaryDark dark:text-neutral-150 ${bodyHeavy} justify-center rounded`}
                                        onClick={handleReconsider}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {decisionMatrixHasResults && (
                <div className="flex items-center py-4 mx-auto space-x-4">
                    <button
                        id={'automatedDecisionMatrix-NewDecision'}
                        onClick={() => {
                            reset()
                            setMatrixStep(0)
                        }}
                        className={feedToolbarClass.newPostButton}
                    >
                        New Decision
                    </button>
                    <button
                        id={'automatedDecisionMatrix-RefineDecision'}
                        className={feedToolbarClass.newPostButton}
                        onClick={() => {
                            setCurrentTab(2)
                        }}
                    >
                        Refine decision
                    </button>
                </div>
            )}
        </div>
    )
}

export default MatrixResultTab
