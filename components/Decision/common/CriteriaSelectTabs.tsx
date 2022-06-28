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
                    ? 'flex-col items-center space-y-4 p-3'
                    : 'items-center justify-between space-x-4 p-4'
            } w-full overflow-auto rounded-2xl bg-white dark:bg-neutralDark-500 ${
                removeShadow
                    ? ''
                    : 'custom-box-shadow dark:custom-box-shadow-dark'
            } `}
        >
            {criteriaTabs.map(item => (
                <div
                    key={`criteria-select-tabs-${item.name}`}
                    className={`whitespace-nowrap font-bold not-italic text-sm tracking-normal md:text-base ${
                        isMobile ? 'w-full' : ''
                    } flex cursor-pointer items-center justify-center rounded-lg py-2 px-4 text-center ${
                        selected?.name === item.name
                            ? 'bg-primary/20 text-primary dark:bg-primaryDark/20 dark:text-primaryDark'
                            : 'bg-white text-neutral-700 dark:bg-neutralDark-300 dark:text-neutral-300'
                    }`}
                    onClick={() => handleClick(item)}
                >
                    {item.name}
                </div>
            ))}
        </div>
    )
}
