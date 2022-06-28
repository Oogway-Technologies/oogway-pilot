import { useUser } from '@auth0/nextjs-auth0'
import {
    UilExclamationTriangle,
    UilPlus,
    UilTrashAlt,
} from '@iconscout/react-unicons'
import React, { FC, useEffect, useState } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'

import {
    addSelectedOption,
    setDecisionActivityId,
    setDecisionQuestion,
    setIsDecisionFormUpdating,
    setIsQuestionSafeForAI,
    setPreviousIndex,
    setUserIgnoredUnsafeWarning,
    updateDecisionFormState,
} from '../../../features/decision/decisionSlice'
import useMediaQuery from '../../../hooks/useMediaQuery'
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import { useCreateDecisionActivity } from '../../../queries/decisionActivity'
import { body, bodyHeavy } from '../../../styles/typography'
import { inputStyle } from '../../../styles/utils'
import { shortLimit } from '../../../utils/constants/global'
import { deepCopy, insertAtArray } from '../../../utils/helpers/common'
import {
    decisionOption,
    FirebaseDecisionActivity,
} from '../../../utils/types/firebase'
import Button from '../../Utils/Button'
import { ErrorWrapperField } from '../../Utils/ErrorWrapperField'
import Modal from '../../Utils/Modal'
import { OptionCard } from '../BottomCards/OptionCard'
import { BaseCard } from '../common/BaseCard'
import { OptionSuggestions } from '../SideCards/OptionSuggestions'
import { SignInCard } from '../SideCards/SignInCard'
import UnsupportedDecision from '../SideCards/UnsupportedDecision'

interface OptionTabProps {
    setCurrentTab: (n: number) => void
    setMatrixStep: (n: number) => void
}

export const OptionTab: FC<OptionTabProps> = ({
    setCurrentTab,
    setMatrixStep,
}) => {
    const {
        register,
        control,
        setValue,
        getValues,
        formState: { errors },
        watch,
        setFocus,
        reset,
    } = useFormContext()

    const {
        decisionQuestion: prevQuestion,
        decisionFormState,
        decisionActivityId,
        userExceedsMaxDecisions,
        isDecisionFormUpdating,
        isQuestionSafeForAI,
        userIgnoredUnsafeWarning,
    } = useAppSelector(state => state.decisionSlice)

    const { fields, remove } = useFieldArray({
        control,
        name: 'options',
    })
    const { user: authUser } = useUser()

    const [isOpen, setOpen] = useState(false)
    const [isAIWarningModalOpen, setIsAIWarningModalOpen] = useState(false)
    const [selectedIndex, setIndex] = useState<number>()
    const createDecision = useCreateDecisionActivity()
    const isMobile = useMediaQuery('(max-width: 965px)')
    const question = getValues('question')
    const watchOptions = watch('options')

    useEffect(() => {
        // On mount, check if new question matches previous question
        // If not, update state to new question and instantiate new
        // decision log
        if (question !== prevQuestion && !isDecisionFormUpdating) {
            // Update previous question
            useAppDispatch(setDecisionQuestion(question))

            // Instantiate new decision
            createDecision.mutate(decisionFormState, {
                onSuccess: newDecision => {
                    useAppDispatch(setDecisionActivityId(newDecision.data.id))
                },
            })
        }

        // to focus on input on mount
        setFocus('options.[0].name')

        return () => {
            useAppDispatch(setPreviousIndex(2))
            setOpen(false)
            setIndex(undefined)
            setValue(`options.[0].name`, '')
        }
    }, [])

    // Track form state
    useEffect(() => {
        if (decisionActivityId) {
            const optionsClone = deepCopy(watchOptions)
            const filteredOptions = optionsClone.filter(
                (item: decisionOption) => {
                    if (item.name) {
                        return item
                    }
                }
            )
            let formState: FirebaseDecisionActivity = {
                id: decisionActivityId,
                isQuestionSafeForAI: isQuestionSafeForAI,
                userIgnoredUnsafeWarning: userIgnoredUnsafeWarning,
                currentTab: 2,
            }
            if (filteredOptions.length)
                formState = {
                    ...formState,
                    options: filteredOptions,
                }
            useAppDispatch(updateDecisionFormState(formState))
            useAppDispatch(setIsDecisionFormUpdating(false))
        }
    }, [
        watchOptions,
        decisionActivityId,
        isQuestionSafeForAI,
        userIgnoredUnsafeWarning,
    ])

    useEffect(() => {
        // handle focus on enter
        if (!watchOptions[0].name) {
            setFocus('options.[0].name')
        }
    }, [watchOptions])

    // Trigger warning modal
    useEffect(() => {
        if (!isQuestionSafeForAI && !userIgnoredUnsafeWarning)
            setIsAIWarningModalOpen(true)
    }, [isQuestionSafeForAI, userIgnoredUnsafeWarning])

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

    const handleWarningClose = () => {
        setIsAIWarningModalOpen(false)
        useAppDispatch(setUserIgnoredUnsafeWarning(true))
    }

    const handleReconsider = () => {
        reset() // reset form state
        useAppDispatch(setIsQuestionSafeForAI(true))
        useAppDispatch(setUserIgnoredUnsafeWarning(false))
        setCurrentTab(0)
        setMatrixStep(0)
    }

    return (
        <div className="mx-1 flex flex-col">
            <span
                className={`${
                    isMobile
                        ? 'sticky top-4 z-50 -mx-1 bg-neutral-25 pt-1 dark:bg-neutralDark-600'
                        : ''
                } -mt-5 font-normal leading-6 text-neutral-800 text-sm tracking-normal dark:text-neutral-150 md:ml-0 md:text-base`}
            >
                Add at least two
            </span>

            {isMobile ? (
                !authUser ? (
                    !userExceedsMaxDecisions ? (
                        <OptionSuggestions />
                    ) : (
                        <SignInCard currentTab={2} />
                    )
                ) : userIgnoredUnsafeWarning ? (
                    <UnsupportedDecision
                        setCurrentTab={setCurrentTab}
                        setMatrixStep={setMatrixStep}
                    />
                ) : (
                    <OptionSuggestions />
                )
            ) : null}

            {fields.map((item, index) =>
                index === 0 ? (
                    <BaseCard
                        key={item.id}
                        className="mt-4 flex flex-col py-5 px-4"
                    >
                        <ErrorWrapperField
                            className="flex flex-col "
                            errorField={
                                errors?.options &&
                                (errors?.options as any)[index]?.name?.message
                                    ? (errors?.options as any)[index]?.name
                                          ?.message
                                    : ''
                            }
                        >
                            <div className="flex w-full items-center">
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
                                                    name: event.currentTarget
                                                        .value,
                                                    isAI: false,
                                                })
                                            )
                                            setValue(`options.[0].name`, '')
                                        }
                                    }}
                                    disabled={
                                        watchOptions.length < 6 ? false : true
                                    }
                                    {...register(
                                        `options.${index}.name` as const,
                                        {
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
                                        }
                                    )}
                                />
                                <button
                                    disabled={
                                        watchOptions.length < 6 ? false : true
                                    }
                                    type="button"
                                    onClick={() => {
                                        const value =
                                            getValues('options.[0].name')
                                        if (value) {
                                            setValue(
                                                'options',
                                                insertAtArray(watchOptions, 1, {
                                                    name: value,
                                                    isAI: false,
                                                })
                                            )
                                            setValue(`options.[0].name`, '')
                                        }
                                    }}
                                    className="ml-3 flex items-center justify-center rounded-full bg-primary p-2 disabled:bg-primary/50"
                                >
                                    <UilPlus className={'fill-white'} />
                                </button>
                            </div>
                        </ErrorWrapperField>
                    </BaseCard>
                ) : (
                    ''
                )
            )}
            <BaseCard className="mt-xl mb-1 flex flex-col p-5">
                <span
                    className={`${bodyHeavy} text-neutral-800 dark:text-white`}
                >
                    Added options
                </span>
                {fields.length === 1 ? (
                    <span className="mt-4 text-center font-normal text-neutral-700 text-sm dark:text-neutralDark-150">
                        No option added yet
                    </span>
                ) : (
                    <div
                        className={
                            isMobile
                                ? 'mt-4 flex flex-col space-y-3'
                                : 'mt-5 grid grid-cols-2 gap-4'
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
                        className={`${body} mt-4 mb-6 text-neutral-800 dark:text-white`}
                    >
                        Are you sure you want to delete this option?
                    </span>
                    <div className="flex items-center justify-between">
                        <Button
                            keepText
                            text="Cancel"
                            className={`w-36 border border-neutral-700 bg-transparent py-2 text-neutral-700 ${bodyHeavy} justify-center rounded dark:border-neutral-150 dark:text-neutral-150`}
                            onClick={handleClose}
                        />
                        <Button
                            keepText
                            text="Delete"
                            className={`w-36 border border-primary bg-primary py-2 text-white dark:border-primaryDark dark:bg-primaryDark ${bodyHeavy} justify-center rounded`}
                            onClick={handleDelete}
                        />
                    </div>
                </div>
            </Modal>
            <Modal show={isAIWarningModalOpen} onClose={handleWarningClose}>
                <div className="flex flex-col sm:w-96">
                    <div className="flex items-center">
                        <UilExclamationTriangle
                            className={'mr-1 fill-alert dark:fill-alert'}
                        />
                        <span
                            className={`${bodyHeavy} text-alert dark:text-alert`}
                        >
                            Warning
                        </span>
                    </div>
                    <div
                        className={`${body} mt-4 mb-6 text-neutral-800 dark:text-white`}
                    >
                        Sorry, this decision violates our policies for content
                        safety and AI cannot provide any information. We
                        recommend you reconsider this decision.
                    </div>
                    <div className="mx-auto flex items-center gap-x-lg">
                        <Button
                            keepText
                            text="Continue"
                            className={`w-36 border border-neutral-700 bg-transparent py-2 text-neutral-700 ${bodyHeavy} justify-center rounded dark:border-neutral-150 dark:text-neutral-150`}
                            onClick={handleWarningClose}
                        />
                        <Button
                            keepText
                            text="Reconsider"
                            className={`w-36 border border-primary bg-transparent py-2 text-primary dark:border-primaryDark dark:bg-primaryDark dark:text-neutral-150 ${bodyHeavy} justify-center rounded`}
                            onClick={handleReconsider}
                        />
                    </div>
                </div>
            </Modal>
        </div>
    )
}
