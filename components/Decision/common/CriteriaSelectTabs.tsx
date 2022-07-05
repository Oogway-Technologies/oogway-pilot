import React, { FC, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'

import { criteriaTabs } from '../../../utils/constants/global'
import { Tab } from '../../../utils/types/global'

interface CriteriaSelectTabsProps {
    registerName: string
    isMobile: boolean
    removeShadow?: boolean
    isDisable?: boolean
}
export const CriteriaSelectTabs: FC<CriteriaSelectTabsProps> = ({
    registerName,
    isMobile,
    removeShadow = false,
    isDisable = false,
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
                <button
                    disabled={!isDisable}
                    type="button"
                    key={`criteria-select-tabs-${item.name}`}
                    className={`whitespace-nowrap font-bold not-italic text-sm tracking-normal md:text-base ${
                        isMobile ? 'w-full' : 'w-1/4'
                    } flex cursor-pointer items-center justify-center rounded-lg p-2 text-center ${
                        selected?.name === item.name
                            ? 'disable:dark:bg-primaryDark/50 disable:text-primary/50 disable:dark:text-primaryDark/50 disable:bg-primary/50 disable:dark:bg-primaryDark/50 bg-primary/20 text-primary dark:text-primaryDark'
                            : 'bg-white text-neutral-700 disabled:text-neutral-700/50 dark:bg-neutralDark-300 dark:text-neutral-300 disabled:dark:bg-neutralDark-300/50 disabled:dark:text-neutral-300/50'
                    }`}
                    onClick={() => handleClick(item)}
                >
                    {item.name}
                </button>
            ))}
        </div>
    )
}
