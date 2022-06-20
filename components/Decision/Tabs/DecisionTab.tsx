import { useUser } from '@auth0/nextjs-auth0'
import React, { FC, useEffect } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'

import {
    setDecisionFormState,
    setIsDecisionFormUpdating,
    setPreviousIndex,
    setUserExceedsMaxDecisions,
    updateDecisionFormState,
} from '../../../features/decision/decisionSlice'
import useMediaQuery from '../../../hooks/useMediaQuery'
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import useResetDecisionHelperCard from '../../../hooks/useResetDecisionHelperCard'
import { useDecisionMatrix } from '../../../queries/getDecisionMatrix'
import { useUnauthenticatedDecisionQuery } from '../../../queries/unauthenticatedDecisions'
import { inputStyle } from '../../../styles/utils'
import {
    longLimit,
    maxAllowedUnauthenticatedDecisions,
    shortLimit,
} from '../../../utils/constants/global'
import preventDefaultOnEnter from '../../../utils/helpers/preventDefaultOnEnter'
import Button from '../../Utils/Button'
import { ErrorWrapper } from '../../Utils/ErrorWrapper'
import { DecisionHelperCard } from '../SideCards/DecisionHelperCard'

interface DecisionTabProps {
    deviceIp: string
    matrixStep?: number
    currentTab: number
    setMatrixStep?: (n: number) => void
}

export const DecisionTab: FC<DecisionTabProps> = ({
    deviceIp,
    currentTab,
    matrixStep,
    setMatrixStep,
}) => {
    const { mutateAsync } = useDecisionMatrix()

    const { register, trigger, clearErrors, getValues, control } =
        useFormContext()
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

            {isMobile && getValues('question').split('').length ? (
                <DecisionHelperCard />
            ) : null}
            {matrixStep === 0 && currentTab === 0 && (
                <Button
                    onClick={() => {
                        mutateAsync({ decision: question, context })
                        if (setMatrixStep) {
                            setMatrixStep(matrixStep + 1)
                        }
                    }}
                    addStyle={`rounded-full w-2/6 justify-center py-2 md:py-3 text-white bg-primary dark:bg-primaryDark hover:bg-primaryActive active:bg-primaryActive dark:hover:bg-primaryActive dark:active:bg-primaryActive ml-auto`}
                    text="Show Result"
                    keepText={true}
                    icon={null}
                    type="button"
                />
            )}
        </>
    )
}
