import React, { FC, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'

import { criteriaTabs } from '../../../utils/constants/global'
import { Tab } from '../../../utils/types/global'

interface CriteriaSelectTabsProps {
    registerName: string
    isMobile: boolean
    removeShadow?: boolean
}
export const CriteriaSelectTabs: FC<CriteriaSelectTabsProps> = ({
    registerName,
    isMobile,
    removeShadow = false,
}: CriteriaSelectTabsProps) => {
    const { getValues, setValue } = useFormContext()
    const [selected, setSelected] = useState<Tab>()

    useEffect(() => {
        const weight = getValues(registerName)
        criteriaTabs.find(item => {
            if (item.weight === weight) {
                setSelected(item)
            }
        })
    }, [registerName])

    const handleClick = (item: Tab) => {
        setSelected(item)
        setValue(registerName, item.weight)
    }

    return (
        <div
            className={`flex ${
                isMobile
                    ? 'flex-col items-center p-3 space-y-4'
                    : 'items-center p-4 space-x-4 justify-between'
            } overflow-auto w-full bg-white dark:bg-neutralDark-500 rounded-2xl ${
                removeShadow
                    ? ''
                    : 'custom-box-shadow dark:custom-box-shadow-dark'
            } `}
        >
            {criteriaTabs.map(item => (
                <div
                    key={`criteria-select-tabs-${item.name}`}
                    className={`md:text-base text-sm not-italic font-bold tracking-normal whitespace-nowrap ${
                        isMobile ? 'w-full' : ''
                    } flex items-center justify-center py-2 px-4 text-center cursor-pointer rounded-lg ${
                        selected?.name === item.name
                            ? 'text-primary dark:text-primaryDark bg-primary/20 dark:bg-primaryDark/20'
                            : 'text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutralDark-300'
                    }`}
                    onClick={() => handleClick(item)}
                >
                    {item.name}
                </div>
            ))}
        </div>
    )
}
