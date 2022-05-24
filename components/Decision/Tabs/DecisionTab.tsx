import React, { useEffect } from 'react'
import { FC } from 'react'
import { useFormContext } from 'react-hook-form'

import { setPreviousIndex } from '../../../features/decision/decisionSlice'
import { useAppDispatch } from '../../../hooks/useRedux'
import useStoreDecisionTableOnUnmount from '../../../hooks/useStoreDecisionTableOnUnmount'
import { inputStyle } from '../../../styles/utils'
import { longLimit, shortLimit } from '../../../utils/constants/global'
import { ErrorWraper } from '../../Utils/ErrorWraper'

export const DecisionTab: FC = () => {
    const { register, trigger, clearErrors, watch } = useFormContext()

    useEffect(() => {
        // to fix error not working on first step.
        trigger('question').then(() => {
            clearErrors('question')
        })
        return () => {
            useAppDispatch(setPreviousIndex(1))
        }
    }, [])

    // Store decision table when tab is unmounted
    useStoreDecisionTableOnUnmount(watch)

    return (
        <>
            <ErrorWraper errorField="question">
                <input
                    className={inputStyle}
                    type="text"
                    placeholder="Where should I move to?"
                    {...register('question' as const, {
                        required: {
                            value: true,
                            message: 'You must enter the required question.',
                        },
                        maxLength: {
                            value: shortLimit,
                            message: `Question length should be less than ${shortLimit}`,
                        },
                    })}
                />
            </ErrorWraper>
            <ErrorWraper errorField="context">
                <textarea
                    className={`${inputStyle} h-40 resize-none`}
                    placeholder="Context for your decision (optional)"
                    {...register('context', {
                        maxLength: {
                            value: longLimit,
                            message: `Context length should be less than ${longLimit}`,
                        },
                    })}
                />
            </ErrorWraper>
        </>
    )
}
