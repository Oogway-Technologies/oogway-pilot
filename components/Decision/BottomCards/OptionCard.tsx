import { UilTimes } from '@iconscout/react-unicons'
import React, { KeyboardEvent, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'

import useMediaQuery from '../../../hooks/useMediaQuery'
import { bodyHeavy, bodyXSmall, caption } from '../../../styles/typography'
import { shortLimit, warningTime } from '../../../utils/constants/global'
import { Options } from '../../../utils/types/global'
import { ErrorWrapperField } from '../../Utils/ErrorWrapperField'
import { BaseCard } from '../common/BaseCard'
import { TabsMenu } from '../common/TabsMenu'

interface OptionID extends Options {
    id: string
}
interface OptionCardProps {
    index: number
    item: OptionID
    onClickRemove: () => void
}
export const OptionCard = ({ item, index, onClickRemove }: OptionCardProps) => {
    const [isEdit, setEdit] = useState(false)
    const isMobile = useMediaQuery('(max-width: 965px)')

    const {
        register,
        trigger,
        formState: { errors },
        clearErrors,
        getValues,
        setValue,
        setFocus,
    } = useFormContext()

    useEffect(() => {
        if (isEdit) {
            setFocus(`options.${index}.name`)
        }
    }, [isEdit])

    const handleCross = () => {
        setFocus(`options.${index}.name`)
        setValue(`options.${index}.name`, '')
    }

    const handleKeyDown = async (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && event.currentTarget.value) {
            await trigger(`options.${index}.name`)
            if (errors?.options) {
                setTimeout(() => clearErrors(['options']), warningTime)
                return false
            } else {
                setEdit(false)
            }
        }
    }

    return isMobile ? (
        <BaseCard
            key={item.id}
            className="flex items-center bg-white p-3 dark:bg-neutralDark-300"
        >
            <div
                className={`flex w-full items-center  ${
                    isEdit ? 'w-full' : 'max-w-[80%]'
                }`}
            >
                {isEdit ? (
                    <ErrorWrapperField
                        errorField={
                            errors?.options &&
                            (errors?.options as any)[index]?.name?.message
                                ? (errors?.options as any)[index]?.name?.message
                                : ''
                        }
                        textClass="text-sm"
                    >
                        <div className="m-2 flex items-center justify-center rounded-lg border border-neutral-700 dark:border-white">
                            <input
                                className="h-8 w-full rounded-lg px-2 font-bold outline-none"
                                {...register(`options.${index}.name` as const, {
                                    required: {
                                        value: true,
                                        message:
                                            'You must enter the required Option.',
                                    },
                                    maxLength: {
                                        value: shortLimit,
                                        message: `Option length should be less than ${shortLimit}`,
                                    },
                                })}
                                onKeyDown={handleKeyDown}
                            />
                            <UilTimes
                                className={
                                    'mx-2 cursor-pointer fill-neutral-700 dark:fill-white'
                                }
                                onClick={handleCross}
                            />
                        </div>
                    </ErrorWrapperField>
                ) : (
                    <span
                        className={`${bodyHeavy} mr-2 truncate whitespace-nowrap text-neutral-800 dark:text-white`}
                    >
                        {getValues(`options.${index}.name`)}
                    </span>
                )}
                {item.isAI ? (
                    <span
                        className={`${caption} border-l border-l-neutral-700 px-2 text-primary`}
                    >
                        AI
                    </span>
                ) : null}
            </div>
            {!isEdit && (
                <TabsMenu
                    firstItemText={'Edit Option'}
                    secondItemText={'Delete Option'}
                    onClickFirst={() => {
                        setEdit(true)
                    }}
                    onClickSecond={onClickRemove}
                    isAI={item.isAI}
                />
            )}
        </BaseCard>
    ) : (
        <BaseCard
            key={item.id}
            className="flex flex-col bg-white dark:bg-neutralDark-300"
        >
            {isEdit ? (
                <ErrorWrapperField
                    errorField={
                        errors?.options &&
                        (errors?.options as any)[index]?.name?.message
                            ? (errors?.options as any)[index]?.name?.message
                            : ''
                    }
                    textClass="text-sm"
                >
                    <div className="m-2 flex items-center justify-center rounded-lg border border-neutral-700 dark:border-white">
                        <input
                            className="h-8 w-full rounded-lg px-2 font-bold outline-none"
                            {...register(`options.${index}.name` as const, {
                                required: {
                                    value: true,
                                    message:
                                        'You must enter the required Option.',
                                },
                                maxLength: {
                                    value: shortLimit,
                                    message: `Option length should be less than ${shortLimit}`,
                                },
                            })}
                            onKeyDown={handleKeyDown}
                        />
                        <UilTimes
                            className={
                                'mx-2 cursor-pointer fill-neutral-700 dark:fill-white'
                            }
                            onClick={handleCross}
                        />
                    </div>
                </ErrorWrapperField>
            ) : (
                <div
                    className={`flex items-center p-3 ${
                        item.isAI ? 'border-b border-neutral-150' : ''
                    }`}
                >
                    <span
                        className={`${bodyHeavy} min-w-[70%] truncate whitespace-nowrap text-neutral-800 dark:text-white`}
                    >
                        {getValues(`options.${index}.name`)}
                    </span>
                    <TabsMenu
                        firstItemText={'Edit Option'}
                        secondItemText={'Delete Option'}
                        onClickFirst={() => {
                            setEdit(true)
                        }}
                        onClickSecond={onClickRemove}
                        isAI={item.isAI}
                    />
                </div>
            )}
            {item.isAI ? (
                <span
                    className={`${bodyXSmall} py-3 text-center text-primary dark:text-primaryDark`}
                >
                    AI Suggestion
                </span>
            ) : null}
        </BaseCard>
    )
}
