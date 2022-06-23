import { useUser } from '@auth0/nextjs-auth0'
import React, { FC, useEffect, useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'

import {
    setDecisionEngineBestOption,
    setDecisionFormState,
    setIsDecisionFormUpdating,
    setPreviousIndex,
    setUserExceedsMaxDecisions,
    updateDecisionFormState,
} from '../../../features/decision/decisionSlice'
import useMediaQuery from '../../../hooks/useMediaQuery'
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import useResetDecisionHelperCard from '../../../hooks/useResetDecisionHelperCard'
import { getDecisionMatrix } from '../../../queries/getDecisionMatrix'
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
    const [isLoading, setLoading] = useState(false)
    const isMobile = useMediaQuery('(max-width: 965px)')
    const { user } = useUser()
    const question: string = useWatch({ name: 'question', control })
    const context: string = useWatch({ name: 'context', control })
    const userProfile = useAppSelector(state => state.userSlice.user)
    const clickedConnect = useAppSelector(
        state => state.decisionSlice.clickedConnect
    )

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
    const { data, isFetched } = useUnauthenticatedDecisionQuery(deviceIp)
    useEffect(() => {
        // Await the query to be fetched
        // If the user is unauthenticated, query the database for their
        // record of unauthenticated decisions. If it exceeds the max,
        // turn off AI.
        if (isFetched && !user) {
            if (
                data?.results?.decisions.length >=
                maxAllowedUnauthenticatedDecisions
            ) {
                useAppDispatch(setUserExceedsMaxDecisions(true))
            }
        }
    }, [isFetched, user])

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
        useAppDispatch(
            setDecisionEngineBestOption(capitalize(data.recommendation))
        )
    }

    const handleAutoMatrix = async () => {
        await trigger(['question', 'context'])
        if (errors?.['question']?.message || errors?.['context']?.message) {
            setTimeout(() => clearErrors(['question', 'context']), warningTime)
        } else {
            setLoading(true)
            try {
                const { data } = (await getDecisionMatrix({
                    decision: question,
                    context,
                })) as { data: MatrixObject }
                convertDataFrameToObject(data)

                setMatrixStep(matrixStep + 1)
            } catch (error) {
                console.log(error)
            }
            setLoading(false)
        }
    }

    return (
        <>
            <div
                className={`flex flex-col rounded-2xl custom-box-shadow dark:custom-box-shadow-dark bg-white dark:bg-neutralDark-300 py-4 px-3 ${
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
                        className={`${inputStyle} h-40 resize-none mb-3 md:mb-6`}
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
                    className={`${feedToolbarClass.newPostButton} w-fit ml-auto`}
                    text={
                        getValues('options').length > 1
                            ? 'Update Result'
                            : 'Show Result'
                    }
                    keepText={true}
                    icon={null}
                    type="button"
                />
            )}
            {isLoading && (
                <div className="flex flex-col space-y-5">
                    <h3
                        className={`${
                            isMobile ? bodyHeavy : 'text-2xl font-bold'
                        } text-neutral-800 dark:text-white capitalize dark:bg-neutralDark-500 bg-white
                    `}
                    >
                        Result
                    </h3>
                    <div
                        className={`${body} flex items-center py-3 px-3 bg-neutral-700 text-white dark:bg-neutralDark-300 rounded-lg`}
                    >
                        Generating your result...
                    </div>
                    <TableLoader />
                </div>
            )}
        </>
    )
}
