import { UilTrashAlt } from '@iconscout/react-unicons'
import React, { FC, useEffect, useState } from 'react'
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
import { body, bodyHeavy } from '../../../styles/typography'
import { inputStyle } from '../../../styles/utils'
import { shortLimit } from '../../../utils/constants/global'
import { insertAtArray } from '../../../utils/helpers/common'
import Button from '../../Utils/Button'
import { ErrorWrapperField } from '../../Utils/ErrorWrapperField'
import Modal from '../../Utils/Modal'
import { BaseCard } from '../common/BaseCard'
import { OptionCard } from '../Sidecards/OptionCard'
import { OptionSuggestions } from '../Sidecards/OptionSuggestions'
import { SignInCard } from '../Sidecards/SignInCard'

interface OptionTabProps {
    deviceIp: string
}

export const OptionTab: FC<OptionTabProps> = ({ deviceIp }) => {
    const {
        register,
        control,
        setValue,
        getValues,
        formState: { errors },
        watch,
        setFocus,
    } = useFormContext()

    const {
        decisionQuestion: prevQuestion,
        clickedConnect,
        userExceedsMaxDecisions,
    } = useAppSelector(state => state.decisionSlice)

    const { fields, remove } = useFieldArray({
        control,
        name: 'options',
    })

    const [isOpen, setOpen] = useState(false)
    const [selectedIndex, setIndex] = useState<number>()
    const createDecision = useCreateDecisionActivity()
    const isMobile = useMediaQuery('(max-width: 965px)')
    const question = getValues('question')
    const user = useAppSelector(state => state.userSlice.user)
    const watchOptions = watch('options')

    useEffect(() => {
        // to focus on input on mount
        setFocus('options.[0].name')

        return () => {
            useAppDispatch(setPreviousIndex(2))
            setOpen(false)
            setIndex(undefined)
            setValue(`options.[0].name`, '')

            // On mount, check if new question matches previous question
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
                    clickedConnect: clickedConnect,
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

    useEffect(() => {
        // handle focus on enter
        if (!watchOptions[0].name) {
            setFocus('options.[0].name')
        }
    }, [watchOptions])

    const handleModal = (index: number) => {
        setIndex(index)
        setOpen(true)
    }

    const handleDelete = () => {
        if (selectedIndex && watchOptions[selectedIndex].isAI) {
            useAppDispatch(addSelectedOption(watchOptions[selectedIndex]))
        }
        remove(selectedIndex)
        setOpen(false)
    }

    const handleClose = () => {
        setIndex(undefined)
        setOpen(false)
    }

    return (
        <div className="flex flex-col mx-1">
            <span
                className={`-mt-5 ${body} text-neutral-800 dark:text-neutral-150`}
            >
                Add at least two
            </span>

            {isMobile ? (
                !userExceedsMaxDecisions ? (
                    <OptionSuggestions />
                ) : (
                    <SignInCard />
                )
            ) : null}

            {fields.map((item, index) =>
                index === 0 ? (
                    <BaseCard
                        key={item.id}
                        className="flex flex-col py-5 px-4 mt-4"
                    >
                        <ErrorWrapperField
                            errorField={
                                errors?.options &&
                                errors?.options[index]?.name?.message
                                    ? errors?.options[index]?.name?.message
                                    : ''
                            }
                        >
                            <input
                                className={inputStyle}
                                type="text"
                                placeholder={'Enter your Option'}
                                onKeyDown={event => {
                                    if (
                                        event.key === 'Enter' &&
                                        event.currentTarget.value
                                    ) {
                                        setValue(
                                            'options',
                                            insertAtArray(watchOptions, 1, {
                                                name: event.currentTarget.value,
                                                isAI: false,
                                            })
                                        )
                                        setValue(`options.[0].name`, '')
                                    }
                                }}
                                {...register(`options.${index}.name` as const, {
                                    required: {
                                        value:
                                            watchOptions.length >= 3
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
                        </ErrorWrapperField>
                    </BaseCard>
                ) : (
                    ''
                )
            )}
            <BaseCard className="flex flex-col p-5 mt-xl mb-1">
                <span
                    className={`${bodyHeavy} text-neutral-800 dark:text-white`}
                >
                    Added options
                </span>
                {fields.length === 1 ? (
                    <span className="mt-4 text-sm font-normal text-center text-neutral-700 dark:text-neutralDark-150">
                        No option added yet
                    </span>
                ) : (
                    <div
                        className={
                            isMobile
                                ? 'mt-4 flex flex-col space-y-3'
                                : 'grid grid-cols-2 gap-4 mt-5'
                        }
                    >
                        {fields.map((item, index) =>
                            index !== 0 ? (
                                <OptionCard
                                    key={`option-card-${index}`}
                                    index={index}
                                    item={item as any}
                                    onClickRemove={() => handleModal(index)}
                                />
                            ) : null
                        )}
                    </div>
                )}
            </BaseCard>
            <Modal show={isOpen} onClose={handleClose}>
                <div className="flex flex-col">
                    <div className="flex items-center">
                        <UilTrashAlt
                            className={'mr-1 fill-neutral-800 dark:fill-white'}
                        />
                        <span
                            className={`${bodyHeavy} text-neutral-800 dark:text-white`}
                        >
                            Delete option
                        </span>
                    </div>
                    <span
                        className={`${body} text-neutral-800 mt-4 mb-6 dark:text-white`}
                    >
                        Are you sure you want to delete this option?
                    </span>
                    <div className="flex justify-between items-center">
                        <Button
                            keepText
                            text="Cancel"
                            className={`border border-neutral-700 text-neutral-700 bg-transparent w-36 py-2 ${bodyHeavy} rounded justify-center dark:text-neutral-150 dark:border-neutral-150`}
                            onClick={handleClose}
                        />
                        <Button
                            keepText
                            text="Delete"
                            className={`border border-primary dark:border-primaryDark bg-primary dark:bg-primaryDark text-white bg-transparent w-36 py-2 ${bodyHeavy} rounded justify-center`}
                            onClick={handleDelete}
                        />
                    </div>
                </div>
            </Modal>
        </div>
    )
}
