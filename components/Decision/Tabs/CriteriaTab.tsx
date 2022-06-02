import { UilPen, UilTrashAlt } from '@iconscout/react-unicons'
import React, { useEffect, useState } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'

import {
    addSelectedCriteria,
    setPreviousIndex,
} from '../../../features/decision/decisionSlice'
import useMediaQuery from '../../../hooks/useMediaQuery'
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import { body, bodyHeavy, bodySmall } from '../../../styles/typography'
import { inputStyle } from '../../../styles/utils'
import { criteriaTabs, shortLimit } from '../../../utils/constants/global'
import { insertAtArray, weightToString } from '../../../utils/helpers/common'
import { Criteria } from '../../../utils/types/global'
import Button from '../../Utils/Button'
import { ErrorWrapperField } from '../../Utils/ErrorWrapperField'
import Modal from '../../Utils/Modal'
import { BaseCard } from '../common/BaseCard'
import { CriteriaSelectTabs } from '../common/CriteriaSelectTabs'
import { CriteriaCard } from '../Sidecards/CriteriaCard'
import { CriteriaSuggestions } from '../Sidecards/CriteriaSuggestions'
import { SignInCard } from '../Sidecards/SignInCard'

export const CriteriaTab = () => {
    const {
        register,
        control,
        setValue,
        formState: { errors },
        watch,
        setFocus,
        getValues,
    } = useFormContext()

    const { userExceedsMaxDecisions } = useAppSelector(
        state => state.decisionSlice
    )

    const { fields, remove } = useFieldArray({
        control,
        name: 'criteria',
    })

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
        setValue(`criteria.${selectedIndex}.name`, selectedItem.name)
        setValue(`criteria.${selectedIndex}.weight`, selectedItem.weight)
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

    useEffect(() => {
        // to focus on input on mount
        setFocus('options.[0].name')

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
            setValue('criteria.[0].name', '')
        }
    }, [])

    useEffect(() => {
        // handle focus on enter
        if (!watchCriteria[0].name) {
            setFocus('criteria.[0].name')
        }
    }, [watchCriteria])

    return (
        <div className="flex flex-col mx-1">
            <span
                className={`-ml-1 md:ml-0 -mt-5 font-normal md:text-base leading-6 tracking-normal text-neutral-800 dark:text-neutral-150 text-sm`}
            >
                Add what you want to consider
            </span>
            {isMobile ? (
                !userExceedsMaxDecisions ? (
                    <CriteriaSuggestions />
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
                                errors?.criteria &&
                                errors?.criteria[index]?.name?.message
                                    ? errors?.criteria[index]?.name?.message
                                    : ''
                            }
                        >
                            <input
                                key={item.id}
                                className={inputStyle}
                                type="text"
                                placeholder={'Enter your Criterion'}
                                onKeyDown={event => {
                                    if (
                                        event.key === 'Enter' &&
                                        event.currentTarget.value
                                    ) {
                                        setValue(
                                            'criteria',
                                            insertAtArray(watchCriteria, 1, {
                                                name: event.currentTarget.value,
                                                weight: getValues(
                                                    'criteria.0.weight'
                                                ),
                                                isAI: false,
                                            })
                                        )
                                        setValue('criteria.[0].name', '')
                                    }
                                }}
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
                                onBlur={event => {
                                    if (event.currentTarget.value) {
                                        setValue(
                                            'criteria',
                                            insertAtArray(watchCriteria, 1, {
                                                name: event.currentTarget.value,
                                                weight: getValues(
                                                    'criteria.0.weight'
                                                ),
                                                isAI: false,
                                            })
                                        )
                                        setValue('criteria.[0].name', '')
                                    }
                                }}
                            />
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
                        />
                    </BaseCard>
                ) : null
            )}
            <BaseCard className="flex flex-col p-5 mt-xl mb-1">
                <span
                    className={`${bodyHeavy} text-neutral-800 dark:text-white`}
                >
                    Added criteria
                </span>
                {fields.length === 1 ? (
                    <span className="mt-4 text-sm font-normal text-center text-neutral-700 dark:text-neutralDark-150">
                        No criteria added yet
                    </span>
                ) : (
                    <div
                        className={
                            isMobile
                                ? 'mt-4 flex flex-col space-y-3'
                                : 'grid grid-cols-2 gap-4 mt-5'
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
                        <UilTrashAlt className={'mr-1 fill-neutral-800'} />
                        <span className={`${bodyHeavy} text-neutral-800`}>
                            Delete criteria
                        </span>
                    </div>
                    <span className={`${body} text-neutral-800 mt-4 mb-6`}>
                        Are you sure you want to delete this criteria?
                    </span>
                    <div className="flex justify-between items-center">
                        <Button
                            keepText
                            text="Cancel"
                            className={`border border-neutral-700 text-neutral-700 bg-transparent w-36 py-2 ${bodyHeavy} rounded justify-center`}
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

            <Modal show={isEdit} onClose={handleCloseEdit}>
                <div className="flex flex-col w-full">
                    <div className="flex items-center mb-4">
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
                        className={inputStyle}
                        type="text"
                        placeholder={'Enter your Criterion'}
                        value={selectedItem?.name}
                        onChange={e =>
                            setItem({
                                ...selectedItem,
                                name: e.target.value,
                            })
                        }
                    />
                    <span
                        className={`${bodySmall} text-primary dark:text-primaryDark mt-1`}
                    >
                        {weightToString(selectedItem.weight)}
                    </span>
                    <div
                        className={`flex flex-col items-center p-3 space-y-2 overflow-scroll w-full bg-white dark:bg-neutralDark-500 rounded-2xl my-1`}
                    >
                        {criteriaTabs.map(item => (
                            <div
                                key={`criteria-select-tabs-${item.name}`}
                                className={`md:text-base text-sm not-italic font-bold tracking-normal whitespace-nowrap w-full flex items-center justify-center py-4 text-center cursor-pointer rounded-lg ${
                                    selectedItem?.weight === item.weight
                                        ? 'text-primary dark:text-primaryDark bg-primary/20 dark:bg-primaryDark/20'
                                        : 'text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutralDark-300 custom-box-shadow dark:custom-box-shadow-dark'
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
                            className={`border border-neutral-700 text-neutral-700 bg-transparent w-36 py-2 ${bodyHeavy} rounded justify-center dark:text-neutral-150 dark:border-neutral-150`}
                            onClick={handleCloseEdit}
                        />
                        <Button
                            keepText
                            text="Update"
                            className={`border border-primary dark:border-primaryDark bg-primary dark:bg-primaryDark text-white bg-transparent w-36 py-2 ${bodyHeavy} rounded justify-center`}
                            onClick={() => handleUpdate()}
                        />
                    </div>
                </div>
            </Modal>
        </div>
    )
}
