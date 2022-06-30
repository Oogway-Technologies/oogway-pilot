import { useUser } from '@auth0/nextjs-auth0'
import React, { FC, useEffect, useRef } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'

import {
    setDecisionEngineBestOption,
    setDecisionFormState,
    setDecisionMatrixHasResults,
    setIsDecisionFormUpdating,
    setIsQuestionSafeForAI,
    setIsThereATie,
    setPreviousIndex,
    setUserExceedsMaxDecisions,
    updateDecisionFormState,
} from '../../../features/decision/decisionSlice'
import useMediaQuery from '../../../hooks/useMediaQuery'
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import useResetDecisionHelperCard from '../../../hooks/useResetDecisionHelperCard'
import { useCreateDecisionMatrix } from '../../../queries/decisionMatrix'
import { useUnauthenticatedDecisionQuery } from '../../../queries/unauthenticatedDecisions'
import { feedToolbarClass } from '../../../styles/feed'
import { body, bodyHeavy } from '../../../styles/typography'
import { inputStyle } from '../../../styles/utils'
import {
    longLimit,
    maxAllowedUnauthenticatedDecisions,
    shortLimit,
    warningTime,
} from '../../../utils/constants/global'
import { capitalize } from '../../../utils/helpers/common'
import preventDefaultOnEnter from '../../../utils/helpers/preventDefaultOnEnter'
import {
    Criteria,
    MatrixObject,
    Options,
    Rating,
    Ratings,
} from '../../../utils/types/global'
import { TableLoader } from '../../Loaders/TableLoader'
import Button from '../../Utils/Button'
import { ErrorWrapper } from '../../Utils/ErrorWrapper'
import { DecisionHelperCard } from '../SideCards/DecisionHelperCard'

interface DecisionTabProps {
    deviceIp: string
    matrixStep: number
    currentTab: number
    setMatrixStep: (n: number) => void
}

export const DecisionTab: FC<DecisionTabProps> = ({
    deviceIp,
    currentTab,
    matrixStep,
    setMatrixStep,
}) => {
    const {
        register,
        trigger,
        clearErrors,
        getValues,
        setValue,
        control,
        formState: { errors },
    } = useFormContext()
    const isMobile = useMediaQuery('(max-width: 965px)')
    const { user } = useUser()
    const scrollRef = useRef<HTMLDivElement>(null)
    const question: string = useWatch({ name: 'question', control })
    const context: string = useWatch({ name: 'context', control })
    const userProfile = useAppSelector(state => state.userSlice.user)
    const clickedConnect = useAppSelector(
        state => state.decisionSlice.clickedConnect
    )

    // Decision Matrix creation mutator
    const decisionMatrix = useCreateDecisionMatrix()

    // Reset decision helper card when question is changed
    useResetDecisionHelperCard(control)

    // Track decision data
    useEffect(() => {
        useAppDispatch(
            setDecisionFormState({
                userId: userProfile?.uid,
                ipAddress: deviceIp,
                question: question,
                isComplete: false,
                currentTab: 2,
            })
        )
        useAppDispatch(setIsDecisionFormUpdating(false))
    }, [question, userProfile])
    useEffect(() => {
        useAppDispatch(
            updateDecisionFormState({
                context: context,
                clickedConnect: clickedConnect,
            })
        )
        useAppDispatch(setIsDecisionFormUpdating(false))
    }, [context, clickedConnect, userProfile])
    useEffect(() => {
        // to fix error not working on first step.
        trigger('question').then(() => {
            clearErrors('question')
        })
        return () => {
            useAppDispatch(setPreviousIndex(1))
        }
    }, [])

    // Track number of decisions made by unauthenticated users
    const { data: unauthenticatedDecisionData, isFetched } =
        useUnauthenticatedDecisionQuery(deviceIp)
    useEffect(() => {
        // Await the query to be fetched
        // If the user is unauthenticated, query the database for their
        // record of unauthenticated decisions. If it exceeds the max,
        // turn off AI.
        if (isFetched && !user) {
            if (
                unauthenticatedDecisionData?.results?.decisions.length >=
                maxAllowedUnauthenticatedDecisions
            ) {
                useAppDispatch(setUserExceedsMaxDecisions(true))
            }
        }
    }, [isFetched, user])

    const calcScore = (index: number): number => {
        let sumWeights = 0
        let sumWeightedScore = 0
        // Calculate denominator
        const criteriaList = getValues('criteria')
        for (const criteria of criteriaList) {
            sumWeights += criteria.weight
        }

        const ratingList = getValues(`ratings.${index}.rating`)
        // Calculate numerator
        if (ratingList) {
            for (const rating of ratingList) {
                sumWeightedScore += rating.value * rating.weight
            }
        }
        return parseFloat((sumWeightedScore / sumWeights).toFixed(1))
    }

    const calcBestOption = (optionList: Options[]) => {
        let currentBestScore = 0
        let currentBestOptions: string[] = []
        for (const option of optionList) {
            if (option.score && option.score > currentBestScore) {
                // If there's only one or zero current best option(s),
                // replace with new best
                if (currentBestOptions.length < 2) {
                    currentBestOptions[0] = option.name
                } else {
                    // If there's a current tie, but current option
                    // dominates both, replace the array
                    currentBestOptions = [option.name]
                }

                // Update new new best score
                currentBestScore = option.score
            }

            // If there's a tie, push to stack
            if (option.score === currentBestScore) {
                currentBestOptions.push(option.name)
            }
        }

        // In case of ties, randomly choose best option
        if ([...new Set(currentBestOptions)].length > 1) {
            useAppDispatch(setIsThereATie(true))
            return currentBestOptions[
                (Math.random() * currentBestOptions.length) | 0
            ]
        } else {
            useAppDispatch(setIsThereATie(false))
            return currentBestOptions[0]
        }
    }

    const convertDataFrameToObject = (data: MatrixObject) => {
        const generateOptions: Options[] = []
        data.ratings.data.forEach(item => {
            generateOptions.push({
                isAI: true,
                name: capitalize(item[0]),
                score: item[data.ratings.columns.length - 1],
            })
        })

        let generateCriteria: Criteria[] = []
        data.weights.columns.forEach((item, index) => {
            generateCriteria.push({
                name: capitalize(item),
                weight: data.weights.data[0][index],
                isAI: true,
            })
        })

        const generateRating: Ratings[] = []
        generateOptions.forEach(({ name }, index) => {
            const rating: Rating[] = []
            data.ratings.data[index].forEach((item, idx) => {
                if (idx !== 0 && idx !== data.ratings.data[index].length - 1) {
                    rating.push({
                        value: item,
                        criteria: generateCriteria[idx].name,
                        weight: generateCriteria[idx].weight,
                    })
                }
            })
            generateRating.push({
                option: name,
                rating,
            })
        })
        setValue('options', generateOptions)
        generateCriteria = generateCriteria.filter(item => item.name)
        setValue('criteria', generateCriteria)
        setValue('ratings', generateRating)
        generateOptions.forEach((_: Options, index: number) => {
            setValue(`options.${index}.score`, calcScore(index))
        })

        useAppDispatch(
            setDecisionEngineBestOption(
                capitalize(calcBestOption(getValues('options')))
            )
        )
    }

    const handleAutoMatrix = async () => {
        await trigger(['question', 'context'])
        if (errors?.['question']?.message || errors?.['context']?.message) {
            setTimeout(() => clearErrors(['question', 'context']), warningTime)
        } else {
            // Call decision matrix
            decisionMatrix.mutate(
                {
                    question,
                    context,
                },
                {
                    onSuccess: response => {
                        if (response.data.is_safe) {
                            convertDataFrameToObject(
                                response.data.results as MatrixObject
                            )
                            useAppDispatch(
                                setDecisionMatrixHasResults(
                                    response.data.has_results
                                )
                            )
                        } else {
                            useAppDispatch(
                                setIsQuestionSafeForAI(response.data.is_safe)
                            )
                            useAppDispatch(
                                setDecisionMatrixHasResults(
                                    response.data.has_results
                                )
                            )
                        }
                    },
                    onError: error => {
                        console.log(error)
                        useAppDispatch(setDecisionMatrixHasResults(false))
                    },
                    onSettled: () => setMatrixStep(matrixStep + 1),
                }
            )
            setTimeout(
                () =>
                    scrollRef.current?.scrollIntoView({
                        block: 'end',
                        behavior: 'smooth',
                    }),
                0
            )
        }
    }

    return (
        <>
            <div
                className={`custom-box-shadow dark:custom-box-shadow-dark flex flex-col rounded-2xl bg-white py-4 px-3 dark:bg-neutralDark-300 ${
                    isMobile ? 'space-y-3' : 'mx-1  space-y-4'
                }`}
            >
                <ErrorWrapper errorField="question">
                    <input
                        className={inputStyle}
                        type="text"
                        onKeyPress={preventDefaultOnEnter}
                        placeholder="Where should I move to?"
                        {...register('question' as const, {
                            required: {
                                value: true,
                                message:
                                    'You must enter the required question.',
                            },
                            maxLength: {
                                value: shortLimit,
                                message: `Question length should be less than ${shortLimit}`,
                            },
                        })}
                    />
                </ErrorWrapper>
                <ErrorWrapper errorField="context">
                    <textarea
                        className={`${inputStyle} mb-3 h-40 resize-none md:mb-6`}
                        placeholder="Context for your decision (optional)"
                        {...register('context', {
                            maxLength: {
                                value: longLimit,
                                message: `Context length should be less than ${longLimit}`,
                            },
                        })}
                    />
                </ErrorWrapper>
            </div>

            {isMobile &&
            currentTab !== 0 &&
            getValues('question').split('').length ? (
                <DecisionHelperCard />
            ) : null}
            {matrixStep === 0 && currentTab === 0 && (
                <Button
                    id={`automatedDecisionMatrix-${
                        getValues('options').length > 1 ? 'update' : 'show'
                    }Result`}
                    onClick={handleAutoMatrix}
                    className={`${feedToolbarClass.newPostButton} ml-auto w-fit disabled:bg-primary/80`}
                    text={
                        getValues('options').length > 1
                            ? 'Update Result'
                            : 'Get Result'
                    }
                    keepText={true}
                    icon={null}
                    type="button"
                    disabled={decisionMatrix.isLoading}
                />
            )}
            {decisionMatrix.isLoading && (
                <div className="flex flex-col space-y-5">
                    <h3
                        className={`${
                            isMobile ? bodyHeavy : 'font-bold text-2xl'
                        } bg-white capitalize text-neutral-800 dark:bg-neutralDark-500 dark:text-white
                    `}
                    >
                        Result
                    </h3>
                    <div
                        className={`${body} flex items-center rounded-lg bg-neutral-700 p-3 text-white dark:bg-neutralDark-300`}
                    >
                        Generating your result...
                    </div>
                    <TableLoader />
                    <div className="h-0 w-0" ref={scrollRef} />
                </div>
            )}
        </>
    )
}
