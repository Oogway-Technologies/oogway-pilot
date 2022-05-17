import { UilPlus, UilTrash } from '@iconscout/react-unicons'
import React, { useEffect } from 'react'
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form'

import {
    addSelectedCriteria,
    setPreviousIndex,
} from '../../../features/decision/decisionSlice'
import useMediaQuery from '../../../hooks/useMediaQuery'
import { useAppDispatch } from '../../../hooks/useRedux'
import { bodySmall } from '../../../styles/typography'
import { AiBox, inputStyle } from '../../../styles/utils'
import { shortLimit } from '../../../utils/constants/global'
import { Criteria } from '../../../utils/types/global'
import { ErrorWraperField } from '../../Utils/ErrorWraperField'
import { CriteriaSelectTabs } from '../common/CriteriaSelectTabs'

export const CriteriaTab = () => {
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
    const isMobile = useMediaQuery('(max-width: 965px)')

    useWatch({
        control,
        name: 'criteria',
    })

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

    const handleDelete = (index: number, item: unknown) => {
        remove(index)
        if ((item as unknown as { isAI: boolean }).isAI) {
            useAppDispatch(addSelectedCriteria(item as unknown as Criteria))
        }
    }

    useEffect(() => {
        return () => {
            useAppDispatch(setPreviousIndex(3))
        }
    }, [])

    return (
        <>
            {fields.map((item, index) => (
                <div
                    className="flex flex-col py-7 px-6 space-y-4 w-full bg-white dark:bg-neutralDark-300 rounded-2xl custom-box-shadow dark:custom-box-shadow-dark"
                    key={item.id}
                >
                    <div className={'flex items-start'}>
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
                                    className={`${inputStyle} ${
                                        (item as unknown as Criteria).isAI
                                            ? 'pr-28'
                                            : ''
                                    }`}
                                    type="text"
                                    placeholder={`Criterion ${index + 1}`}
                                    disabled={
                                        (item as unknown as Criteria).isAI
                                    }
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
                                    <div className={AiBox}>
                                        AI{!isMobile ? ' Suggestion' : ''}
                                    </div>
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
                                onClick={() => handleDelete(index, item)}
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
                            className={`flex justify-start items-center mr-auto text-neutral-700 dark:text-neutralDark-150 ${bodySmall}`}
                        >
                            And how important is this to you?
                        </span>
                    )}
                    <CriteriaSelectTabs
                        registerName={`criteria.${index}.weight` as const}
                    />
                </div>
            ))}
        </>
    )
}
