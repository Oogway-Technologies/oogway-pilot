import React, { FC, useEffect, useRef } from 'react'
import { useFormContext } from 'react-hook-form'

import {
    setClickedConnect,
    setDecisionActivityId,
    setDecisionFormState,
    setDecisionQuestion,
    setInfoCards,
    setIsDecisionRehydrated,
    setIsQuestionSafeForAI,
    setSideCardStep,
    setUserIgnoredUnsafeWarning,
    updateFormCopy,
} from '../../../features/decision/decisionSlice'
import useMediaQuery from '../../../hooks/useMediaQuery'
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import { useCreateDecisionActivity } from '../../../queries/decisionActivity'
import { feedToolbarClass } from '../../../styles/feed'
import { body, bodyHeavy } from '../../../styles/typography'
import { deepCopy } from '../../../utils/helpers/common'
import { Criteria, Options } from '../../../utils/types/global'
import Button from '../../Utils/Button'
import { ResultChart } from '../common/ResultChart'
import { ResultTable } from '../common/ResultTable'

interface MatrixResultTabProps {
    deviceIp: string
    setMatrixStep: (n: number) => void
    setCurrentTab: (n: number) => void
}
const MatrixResultTab: FC<MatrixResultTabProps> = ({
    deviceIp,
    setMatrixStep,
    setCurrentTab,
}: MatrixResultTabProps) => {
    const isMobile = useMediaQuery('(max-width: 965px)')
    const scrollRef = useRef<HTMLDivElement>(null)
    const { reset, getValues, setValue } = useFormContext()
    const userProfile = useAppSelector(state => state.userSlice.user)
    const {
        decisionEngineBestOption,
        isThereATie,
        decisionMatrixHasResults,
        isQuestionSafeForAI,
        clickedConnect,
        decisionActivityId,
        formCopy,
    } = useAppSelector(state => state.decisionSlice)

    const createOrUpdateDecision = useCreateDecisionActivity()

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
        if (decisionMatrixHasResults) {
            fixUpStates()
            createOrUpdateDecision.mutate(
                {
                    clickedConnect: clickedConnect,
                    userId: userProfile.uid,
                    ipAddress: deviceIp,
                    question: getValues('question'),
                    context: getValues('context'),
                    options: getValues('options'), // Only differs from suggestions if user later modifies
                    suggestedOptions: getValues('options'),
                    criteria: getValues('criteria'), // Only differs from suggestions if user later modifies
                    suggestedCriteria: getValues('criteria'),
                    ratings: getValues('ratings'), // Only differs from suggestions if user later modifies,
                    suggestedRatings: getValues('ratings'),
                    isComplete: true,
                    currentTab: 5,
                    userIgnoredUnsafeWarning: false,
                    isQuestionSafeForAI: true,
                },
                {
                    onSuccess: newDecision => {
                        useAppDispatch(
                            setDecisionActivityId(newDecision.data.id)
                        )
                    },
                }
            )
            useAppDispatch(
                updateFormCopy(
                    deepCopy({
                        question: getValues('question'),
                        context: getValues('context'),
                        options: getValues('options'),
                        criteria: getValues('criteria'),
                    })
                )
            )
        }

        setTimeout(
            () =>
                scrollRef.current?.scrollIntoView({
                    block: 'start',
                    behavior: 'smooth',
                }),
            0
        )
    }, [])

    const handleReconsiderOrNewDecision = () => {
        reset() // reset form state
        useAppDispatch(setIsQuestionSafeForAI(true))
        useAppDispatch(setUserIgnoredUnsafeWarning(false))
        useAppDispatch(setDecisionActivityId(undefined))
        useAppDispatch(setDecisionQuestion(undefined))
        useAppDispatch(setSideCardStep(1))
        useAppDispatch(setClickedConnect(false))
        useAppDispatch(setDecisionFormState({}))
        useAppDispatch(setIsDecisionRehydrated(false))
        useAppDispatch(setInfoCards(undefined))
        setCurrentTab(0)
        setMatrixStep(0)
    }

    const handleContinueWithUnsupportedDecision = () => {
        if (!isQuestionSafeForAI)
            useAppDispatch(setUserIgnoredUnsafeWarning(true))
        // Log new decision
        createOrUpdateDecision.mutate(
            {
                clickedConnect: clickedConnect,
                userId: userProfile.uid,
                ipAddress: deviceIp,
                question: getValues('question'),
                context: getValues('context'),
                suggestedCriteria: null,
                suggestedOptions: null,
                suggestedRatings: null,
                isComplete: false,
                currentTab: 2,
                userIgnoredUnsafeWarning: isQuestionSafeForAI ? false : true,
                isQuestionSafeForAI: isQuestionSafeForAI,
            },
            {
                onSuccess: newDecision => {
                    useAppDispatch(setDecisionActivityId(newDecision.data.id))
                    setCurrentTab(2)
                },
            }
        )
        // Set form copy
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

    const handleRefineDecision = () => {
        // update previous decision
        createOrUpdateDecision.mutate({
            id: decisionActivityId,
            isComplete: false,
            currentTab: 2,
        })
        setCurrentTab(2)
    }

    return (
        <div className="mb-3 flex flex-col space-y-3">
            {decisionMatrixHasResults ? (
                <>
                    <div className="h-0 w-0" ref={scrollRef} />
                    <div className="my-4 mb-3 flex flex-col space-y-1 text-center">
                        {isThereATie ? (
                            <>
                                <span
                                    className={`text-center font-bold leading-10 text-neutral-800 text-xl tracking-normal dark:text-white`}
                                >
                                    It’s a tie so we picked one for you.
                                </span>
                                <span
                                    className={`${body} text-neutral-700 dark:text-neutralDark-150`}
                                >
                                    Your best option is{' '}
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
                                <span className="text-center font-bold leading-10 text-primary text-3xl tracking-normal dark:text-primaryDark">
                                    {decisionEngineBestOption}
                                </span>
                            </>
                        )}
                    </div>
                    <div className="my-3" />
                    <ResultChart />
                    <div className="my-3" />
                    <ResultTable />
                </>
            ) : (
                <div
                    className={
                        isMobile ? 'flex flex-col-reverse' : 'grid grid-cols-3'
                    }
                >
                    <div></div>
                    <div className="col-span-2 col-start-2 mx-auto flex flex-col">
                        <div
                            className={`flex flex-col gap-y-md
                                ${
                                    isMobile
                                        ? 'my-4'
                                        : 'custom-box-shadow-md dark:custom-box-shadow-dark-md mb-4 mr-4 rounded-2xl rounded-bl-none bg-white py-4 px-3 dark:bg-neutralDark-500'
                                }`}
                        >
                            <span className="mt-4 text-left font-normal text-neutral-700 text-sm dark:text-neutralDark-150">
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
                                    onClick={
                                        handleContinueWithUnsupportedDecision
                                    }
                                />
                                {!isQuestionSafeForAI && (
                                    <Button
                                        keepText
                                        text="Reconsider"
                                        className={`w-36 border border-primary bg-transparent py-2 text-primary dark:border-primaryDark dark:bg-primaryDark dark:text-neutral-150 ${bodyHeavy} justify-center rounded`}
                                        onClick={handleReconsiderOrNewDecision}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {decisionMatrixHasResults && (
                <div className="mx-auto flex items-center space-x-4 py-4">
                    <button
                        id={'automatedDecisionMatrix-NewDecision'}
                        onClick={handleReconsiderOrNewDecision}
                        className={feedToolbarClass.newPostButton}
                    >
                        New Decision
                    </button>
                    <button
                        id={'automatedDecisionMatrix-RefineDecision'}
                        className={feedToolbarClass.newPostButton}
                        onClick={handleRefineDecision}
                    >
                        Refine decision
                    </button>
                </div>
            )}
        </div>
    )
}

export default MatrixResultTab
