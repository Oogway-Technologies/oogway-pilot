import { UilPlus, UilTrash } from '@iconscout/react-unicons'
import React, { FC, useEffect } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'

import {
    addSelectedOption,
    setDecisionActivityId,
    setDecisionQuestion,
    setPreviousIndex,
} from '../../../features/decision/decisionSlice'
import useMediaQuery from '../../../hooks/useMediaQuery'
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import { useCreateDecisionActivity } from '../../../queries/decisionActivity'
import { AiBox, inputStyle } from '../../../styles/utils'
import { shortLimit } from '../../../utils/constants/global'
import { Options } from '../../../utils/types/global'
import { ErrorWraperField } from '../../Utils/ErrorWraperField'

interface OptionTabProps {
    deviceIp: string
}

export const OptionTab: FC<OptionTabProps> = ({ deviceIp }) => {
    const {
        register,
        control,
        watch,
        setValue,
        getValues,
        formState: { errors },
    } = useFormContext()
    const isMobile = useMediaQuery('(max-width: 965px)')

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'options',
    })
    const question = getValues('question')
    const optionsArray = watch(`options`)

    const user = useAppSelector(state => state.userSlice.user)
    const prevQuestion = useAppSelector(
        state => state.decisionSlice.decisionQuestion
    )
    const createDecision = useCreateDecisionActivity()

    useEffect(() => {
        return () => {
            useAppDispatch(setPreviousIndex(2))

            // On dismount, check if new question matches previous question
            // If not, update state to new question and instantiate new
            // decision log
            if (question !== prevQuestion) {
                // Update previous question
                useAppDispatch(setDecisionQuestion(question))

                // Instantiate new decision
                const initialDecisionInfo = {
                    userId: user.uid,
                    ipAddress: deviceIp,
                    isComplete: false,
                    clickedConnect: getValues('clickedConnect'),
                }
                createDecision.mutate(initialDecisionInfo, {
                    onSuccess: newDecision => {
                        useAppDispatch(
                            setDecisionActivityId(newDecision.data.id)
                        )
                    },
                })
            }
        }
    }, [])

    // handler functions
    const checkFilledFields = () => {
        let check = false
        optionsArray.forEach((option: { name: string }) => {
            if (!option.name) {
                check = true
            }
        })
        return check
    }

    return (
        <>
            {fields.map((item, index) => (
                <div key={item.id} className={'flex items-start w-full'}>
                    <ErrorWraperField
                        errorField={
                            errors?.options &&
                            errors?.options[index]?.name?.message
                                ? errors?.options[index]?.name?.message
                                : ''
                        }
                    >
                        <>
                            <input
                                key={item.id}
                                className={`${inputStyle} ${
                                    (item as unknown as Options).isAI
                                        ? 'pr-28'
                                        : ''
                                }`}
                                type="text"
                                disabled={(item as unknown as Options).isAI}
                                placeholder={`Enter your Option ${index + 1}`}
                                {...register(`options.${index}.name` as const, {
                                    required: {
                                        value:
                                            index === fields.length - 1 &&
                                            index > 1
                                                ? false
                                                : true,
                                        message:
                                            'You must enter the required Option.',
                                    },
                                    maxLength: {
                                        value: shortLimit,
                                        message: `Option length should be less than ${shortLimit}`,
                                    },
                                })}
                            />
                            {(item as unknown as Options).isAI && (
                                <div className={AiBox}>
                                    AI{!isMobile ? ' Suggestion' : ''}
                                </div>
                            )}
                        </>
                    </ErrorWraperField>

                    {(item as unknown as Options).isAI ||
                    ((item as unknown as Options).isAI &&
                        index === fields.length - 1) ? (
                        index === 4 ? (
                            <button
                                className="p-1 my-2 ml-3"
                                type="button"
                                onClick={() => {
                                    if (
                                        (item as unknown as { isAI: boolean })
                                            .isAI
                                    ) {
                                        useAppDispatch(
                                            addSelectedOption(
                                                item as unknown as {
                                                    name: string
                                                    isAI: boolean
                                                }
                                            )
                                        )
                                    }
                                    remove(index)
                                    if (fields[index]) {
                                        append({ name: '', isAI: false })
                                    }
                                }}
                            >
                                <UilTrash className={'fill-neutral-700'} />
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
                                            addSelectedOption(
                                                item as unknown as {
                                                    name: string
                                                    isAI: boolean
                                                }
                                            )
                                        )
                                    }
                                    if (
                                        optionsArray.length === 2 ||
                                        optionsArray.length === 1
                                    ) {
                                        if (fields[index]) {
                                            append({ name: '', isAI: false })
                                        }
                                    }
                                }}
                            >
                                <UilTrash className={'fill-neutral-700'} />
                            </button>
                        )
                    ) : index === fields.length - 1 ? (
                        index < 4 ? (
                            <button
                                className="p-1 my-2 ml-3 align-middle bg-primary disabled:bg-primary/40 rounded-full"
                                type="button"
                                disabled={checkFilledFields()}
                                onClick={() => {
                                    if (fields[index]) {
                                        append({ name: '', isAI: false })
                                    }
                                }}
                            >
                                <UilPlus className={'fill-white'} />
                            </button>
                        ) : (
                            <button
                                className="p-1 my-2 ml-3"
                                type="button"
                                onClick={() => {
                                    if (index === 4) {
                                        setValue(`options.${index}.name`, '')
                                    } else {
                                        remove(index)
                                    }
                                }}
                            >
                                <UilTrash className={'fill-neutral-700'} />
                            </button>
                        )
                    ) : index > 1 ? (
                        <button
                            className="p-1 my-2 ml-3"
                            type="button"
                            onClick={() => {
                                remove(index)
                                if (index === 0 || index === 1) {
                                    append({ name: '', isAI: false })
                                }
                                if (
                                    (item as unknown as { isAI: boolean }).isAI
                                ) {
                                    useAppDispatch(
                                        addSelectedOption(
                                            item as unknown as {
                                                name: string
                                                isAI: boolean
                                            }
                                        )
                                    )
                                }
                            }}
                        >
                            <UilTrash className={'fill-neutral-700'} />
                        </button>
                    ) : optionsArray[index].name ? (
                        <button
                            className="p-1 my-2 ml-3"
                            type="button"
                            onClick={() => {
                                if (
                                    optionsArray.length === 1 ||
                                    optionsArray.length === 2
                                ) {
                                    remove(index)
                                    append({ name: '', isAI: false })
                                } else {
                                    remove(index)
                                }
                            }}
                        >
                            <UilTrash className={'fill-neutral-700'} />
                        </button>
                    ) : (
                        <span className="p-1 my-2 ml-3 w-8 h-8" />
                    )}
                </div>
            ))}
        </>
    )
}
