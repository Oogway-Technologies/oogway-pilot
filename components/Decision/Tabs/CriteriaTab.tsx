import { useUser } from '@auth0/nextjs-auth0'
import { UilPen, UilPlus, UilTrashAlt } from '@iconscout/react-unicons'
import React, { FC, KeyboardEvent, useEffect, useState } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'

import {
    addSelectedCriteria,
    setPreviousIndex,
    updateDecisionFormState,
} from '../../../features/decision/decisionSlice'
import useMediaQuery from '../../../hooks/useMediaQuery'
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import { body, bodyHeavy, bodySmall } from '../../../styles/typography'
import { inputStyle } from '../../../styles/utils'
import { criteriaTabs, shortLimit } from '../../../utils/constants/global'
import {
    deepCopy,
    insertAtArray,
    weightToString,
} from '../../../utils/helpers/common'
import {
    decisionCriteria,
    FirebaseDecisionActivity,
} from '../../../utils/types/firebase'
import { Criteria } from '../../../utils/types/global'
import Button from '../../Utils/Button'
import { ErrorWrapperField } from '../../Utils/ErrorWrapperField'
import Modal from '../../Utils/Modal'
import { CriteriaCard } from '../BottomCards/CriteriaCard'
import { BaseCard } from '../common/BaseCard'
import { CriteriaSelectTabs } from '../common/CriteriaSelectTabs'
import { CriteriaSuggestions } from '../SideCards/CriteriaSuggestions'
import { SignInCard } from '../SideCards/SignInCard'

export const CriteriaTab: FC = () => {
    const {
        register,
        control,
        formState: { errors },
        watch,
        setFocus,
        setValue,
        getValues,
    } = useFormContext()

    const { userExceedsMaxDecisions, decisionActivityId } = useAppSelector(
        state => state.decisionSlice
    )

    const { fields, remove } = useFieldArray({
        control,
        name: 'criteria',
    })
    const { user } = useUser()

    const [isEdit, setEdit] = useState(false)
    const [isOpen, setOpen] = useState(false)
    const [selectedIndex, setIndex] = useState<number>()
    const isMobile = useMediaQuery('(max-width: 965px)')
    const watchCriteria: Criteria[] = watch('criteria')
    const [selectedItem, setItem] = useState<Criteria>({
        isAI: false,
        name: '',
        weight: 1,
    })

    const handleEdit = (item: Criteria, index: number) => {
        setIndex(index)
        setItem(item)
        setEdit(true)
    }

    const handleCloseEdit = () => {
        setIndex(undefined)
        setItem({ isAI: false, name: '', weight: 1 })
        setEdit(false)
    }

    const handleUpdate = () => {
        if (selectedItem.isAI) {
            setValue(`criteria.${selectedIndex}.weight`, selectedItem.weight)
        } else {
            setValue(`criteria.${selectedIndex}.name`, selectedItem.name)
            setValue(`criteria.${selectedIndex}.weight`, selectedItem.weight)
        }

        setEdit(false)
    }

    const handleModal = (index: number) => {
        setIndex(index)
        setOpen(true)
    }

    const handleDelete = () => {
        if (selectedIndex && watchCriteria[selectedIndex].isAI) {
            useAppDispatch(addSelectedCriteria(watchCriteria[selectedIndex]))
        }
        remove(selectedIndex)
        setOpen(false)
    }

    const handleClose = () => {
        setIndex(undefined)
        setOpen(false)
    }

    const handleAdd = () => {
        const value = getValues('criteria.0.weight')
        if (value) {
            setValue(
                'criteria',
                insertAtArray(watchCriteria, 1, {
                    name: getValues('criteria.[0].name'),
                    weight: getValues('criteria.0.weight'),
                    isAI: false,
                })
            )
            setValue('criteria.[0].name', '')
        }
    }

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && event.currentTarget.value) {
            setValue(
                'criteria',
                insertAtArray(watchCriteria, 1, {
                    name: event.currentTarget.value,
                    weight: getValues('criteria.0.weight'),
                    isAI: false,
                })
            )
            setValue('criteria.[0].name', '')
        }
    }

    useEffect(() => {
        // to focus on input on mount
        setFocus('criteria.[0].name')

        // On mount, log form state from previous tab
        // updateDecision.mutate(decisionFormState)

        return () => {
            useAppDispatch(setPreviousIndex(3))
            setOpen(false)
            setEdit(false)
            setIndex(undefined)
            setItem({
                isAI: false,
                name: '',
                weight: 1,
            })
            if (getValues('criteria.[0].name')) {
                setValue(
                    'criteria',
                    insertAtArray(watchCriteria, 1, {
                        name: getValues('criteria.0.name'),
                        weight: getValues('criteria.0.weight'),
                        isAI: false,
                    })
                )
                setValue('criteria.[0].name', '')
            }
        }
    }, [])

    useEffect(() => {
        // handle focus on enter
        if (!watchCriteria[0].name) {
            setFocus('criteria.[0].name')
        }
    }, [watchCriteria])

    // Track form state
    useEffect(() => {
        if (decisionActivityId) {
            // to remove empty criteria if any.
            const criteriaClone = deepCopy(watchCriteria)
            const filteredCriteria = criteriaClone.filter(
                (item: decisionCriteria) => {
                    if (item.name) {
                        return deepCopy(item)
                    }
                }
            )
            let formState: FirebaseDecisionActivity = {
                currentTab: 3,
            }
            if (filteredCriteria.length)
                formState = {
                    ...formState,
                    criteria: filteredCriteria,
                }
            useAppDispatch(updateDecisionFormState(formState))
        }
    }, [decisionActivityId, watchCriteria])

    return (
        <div className="mx-1 flex flex-col">
            <span
                className={`${
                    isMobile
                        ? 'sticky top-4 z-50 -mx-1 bg-neutral-25 pt-1 dark:bg-neutralDark-600'
                        : ''
                } -mt-5 font-normal leading-6 text-neutral-800 text-sm tracking-normal dark:text-neutral-150 md:ml-0 md:text-base`}
            >
                Add what you want to consider
            </span>
            {isMobile ? (
                !user ? (
                    !userExceedsMaxDecisions ? (
                        <CriteriaSuggestions />
                    ) : (
                        <SignInCard currentTab={3} />
                    )
                ) : (
                    <CriteriaSuggestions />
                )
            ) : null}

            {fields.map((item, index) =>
                index === 0 ? (
                    <BaseCard
                        key={item.id}
                        className="mt-4 flex flex-col py-5 px-4"
                    >
                        <ErrorWrapperField
                            className="flex flex-col"
                            errorField={
                                errors?.criteria &&
                                (errors?.criteria as any)[index]?.name?.message
                                    ? (errors?.criteria as any)[index]?.name
                                          ?.message
                                    : ''
                            }
                        >
                            <div className="flex w-full items-center">
                                <input
                                    key={item.id}
                                    className={inputStyle}
                                    type="text"
                                    placeholder={'Enter your Criterion'}
                                    onKeyDown={event => handleKeyDown(event)}
                                    {...register(
                                        `criteria.${index}.name` as const,
                                        {
                                            required: {
                                                value:
                                                    watchCriteria.length >= 2
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
                                <button
                                    disabled={
                                        !getValues(`criteria.${index}.name`)
                                    }
                                    type="button"
                                    onClick={handleAdd}
                                    className="ml-3 flex items-center justify-center rounded-full bg-primary p-2 disabled:bg-primary/50"
                                >
                                    <UilPlus className={'fill-white'} />
                                </button>
                            </div>
                        </ErrorWrapperField>
                        <span
                            className={`text-neutral-700 dark:text-neutralDark-150 ${bodySmall} mt-5 mb-2`}
                        >
                            And how important is this to you?
                        </span>
                        <CriteriaSelectTabs
                            key={item.id}
                            registerName={'criteria.0.weight' as const}
                            isMobile={isMobile}
                            isDisable={getValues(`criteria.${index}.name`)}
                        />
                    </BaseCard>
                ) : null
            )}
            <BaseCard className="mt-xl mb-1 flex flex-col p-5">
                <span
                    className={`${bodyHeavy} text-neutral-800 dark:text-white`}
                >
                    Added criteria
                </span>
                {fields.length === 1 ? (
                    <span className="mt-4 text-center font-normal text-neutral-700 text-sm dark:text-neutralDark-150">
                        No criteria added yet
                    </span>
                ) : (
                    <div
                        className={
                            isMobile
                                ? 'mt-4 flex flex-col space-y-3'
                                : 'mt-5 grid grid-cols-2 gap-4'
                        }
                    >
                        {watchCriteria.map((item, index) =>
                            index !== 0 ? (
                                <CriteriaCard
                                    key={`criteria-card-${index}`}
                                    item={item as any}
                                    onClickRemove={() => handleModal(index)}
                                    onClickEdit={() =>
                                        handleEdit(item as any, index)
                                    }
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
                            Delete criteria
                        </span>
                    </div>
                    <span
                        className={`${body} mt-4 mb-6 text-neutral-800 dark:text-white`}
                    >
                        Are you sure you want to delete this criteria?
                    </span>
                    <div className="flex items-center justify-between">
                        <Button
                            keepText
                            text="Cancel"
                            className={`w-36 border border-neutral-700 bg-transparent py-2 text-neutral-700 dark:border-neutral-150 dark:text-neutral-150 ${bodyHeavy} justify-center rounded`}
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

            <Modal show={isEdit} onClose={handleCloseEdit}>
                <div className="flex w-full flex-col">
                    <div className="mb-4 flex items-center">
                        <UilPen
                            className={'mr-1 fill-neutral-800 dark:fill-white'}
                        />
                        <span
                            className={`${bodyHeavy} text-neutral-800 dark:text-white`}
                        >
                            Edit criteria
                        </span>
                    </div>
                    <input
                        className={`${inputStyle} disabled:border-none disabled:p-0 disabled:font-bold`}
                        type="text"
                        placeholder={'Enter your Criterion'}
                        value={selectedItem?.name}
                        onChange={e =>
                            setItem({
                                ...selectedItem,
                                name: e.target.value,
                            })
                        }
                        disabled={selectedItem.isAI}
                    />
                    <span
                        className={`${bodySmall} mt-1 text-primary dark:text-primaryDark`}
                    >
                        {weightToString(selectedItem.weight)}
                    </span>
                    <div
                        className={`my-1 flex w-full flex-col items-center space-y-2 overflow-scroll rounded-2xl bg-white p-3 dark:bg-neutralDark-500`}
                    >
                        {criteriaTabs.map(item => (
                            <div
                                key={`criteria-select-tabs-${item.name}`}
                                className={`flex w-full cursor-pointer items-center justify-center whitespace-nowrap rounded-lg py-4 text-center font-bold not-italic text-sm tracking-normal md:text-base ${
                                    selectedItem?.weight === item.weight
                                        ? 'bg-primary/20 text-primary dark:bg-primaryDark/20 dark:text-primaryDark'
                                        : 'custom-box-shadow dark:custom-box-shadow-dark bg-white text-neutral-700 dark:bg-neutralDark-300 dark:text-neutral-300'
                                }`}
                                onClick={() =>
                                    setItem({
                                        ...selectedItem,
                                        weight: item.weight,
                                    })
                                }
                            >
                                {item.name}
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center space-x-4">
                        <Button
                            keepText
                            text="Cancel"
                            className={`w-36 border border-neutral-700 bg-transparent py-2 text-neutral-700 ${bodyHeavy} justify-center rounded dark:border-neutral-150 dark:text-neutral-150`}
                            onClick={handleCloseEdit}
                        />
                        <Button
                            keepText
                            text="Update"
                            className={`w-36 border border-primary bg-primary py-2 text-white dark:border-primaryDark dark:bg-primaryDark ${bodyHeavy} justify-center rounded`}
                            onClick={() => handleUpdate()}
                        />
                    </div>
                </div>
            </Modal>
        </div>
    )
}
