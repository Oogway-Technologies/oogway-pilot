import { UilPlus, UilTrash } from '@iconscout/react-unicons'
import React, { useEffect } from 'react'
import { FC } from 'react'
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form'

import {
    addSelectedCriteria,
    setDecisionRatingUpdate,
} from '../../../features/decision/decisionSlice'
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import { bodyHeavy } from '../../../styles/typography'
import { AiBox, inputStyle } from '../../../styles/utils'
import { shortLimit } from '../../../utils/constants/global'
import { ErrorWraperField } from '../../Utils/ErrorWraperField'
import { OptionSlider } from '../common/OptionSlider'

export const CriteriaTab: FC = () => {
    const decisionRatingUpdate = useAppSelector(
        state => state.decisionSlice.decisionRatingUpdate
    )
    const {
        register,
        control,
        getValues,
        formState: { errors },
    } = useFormContext()
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'criteria',
    })
    useWatch({
        control,
        name: 'criteria',
    })

    useEffect(() => {
        if (!decisionRatingUpdate) {
            useAppDispatch(setDecisionRatingUpdate(true))
        }
    }, [])

    const checkFilledFields = () => {
        const criteriaArray = getValues(`criteria`)
        let check = false
        criteriaArray.forEach((option: { name: string }) => {
            if (!option.name) {
                check = true
            }
        })
        return check
    }
    return (
        <>
            {fields.map((item, index) => (
                <React.Fragment key={item.id}>
                    <div className={'flex items-start w-full'}>
                        <ErrorWraperField
                            errorField={
                                errors?.criteria &&
                                errors?.criteria[index]?.name?.message
                                    ? errors?.criteria[index]?.name?.message
                                    : ''
                            }
                        >
                            <>
                                <input
                                    key={item.id}
                                    className={inputStyle}
                                    type="text"
                                    placeholder={`Criterion ${index + 1}`}
                                    {...register(
                                        `criteria.${index}.name` as const,
                                        {
                                            required: {
                                                value:
                                                    index ===
                                                        fields.length - 1 &&
                                                    index > 0
                                                        ? false
                                                        : true,
                                                message:
                                                    'You must enter the required criteria.',
                                            },
                                            maxLength: {
                                                value: shortLimit,
                                                message: `Criteria length should be less than ${shortLimit}`,
                                            },
                                        }
                                    )}
                                />
                                {(item as unknown as { isAI: boolean })
                                    .isAI && (
                                    <div className={AiBox}>AI Suggestion</div>
                                )}
                            </>
                        </ErrorWraperField>
                        {index === fields.length - 1 ? (
                            <button
                                className="p-1 my-2 ml-3 align-middle bg-primary disabled:bg-primary/40 dark:bg-primaryDark rounded-full"
                                type="button"
                                disabled={checkFilledFields()}
                                onClick={() => {
                                    append({
                                        name: '',
                                        weight: 2,
                                        isAI: false,
                                    })
                                }}
                            >
                                <UilPlus className={'fill-white'} />
                            </button>
                        ) : (
                            <button
                                className="p-1 my-2 ml-3"
                                type="button"
                                onClick={() => {
                                    remove(index)
                                    if (
                                        (item as unknown as { isAI: boolean })
                                            .isAI
                                    ) {
                                        useAppDispatch(
                                            addSelectedCriteria(
                                                item as unknown as {
                                                    name: string
                                                    weight: number
                                                    isAI: boolean
                                                }
                                            )
                                        )
                                    }
                                }}
                            >
                                <UilTrash
                                    className={
                                        'fill-neutral-700 dark:fill-neutralDark-150'
                                    }
                                />
                            </button>
                        )}
                    </div>
                    {index === 0 && (
                        <span
                            className={`flex justify-start items-center mr-auto text-neutral-700 dark:text-neutralDark-150 pt-4 ${bodyHeavy}`}
                        >
                            And how important is this to you?
                        </span>
                    )}
                    <OptionSlider
                        id={item.id + index}
                        registerName={`criteria.${index}.weight` as const}
                        min={1}
                        max={4}
                        step={1}
                        showValues={true}
                    />
                </React.Fragment>
            ))}
        </>
    )
}
