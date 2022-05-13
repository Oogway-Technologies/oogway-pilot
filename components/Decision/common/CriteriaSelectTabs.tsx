import React, { FC, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'

import useMediaQuery from '../../../hooks/useMediaQuery'
import { bodyHeavy } from '../../../styles/typography'

type Tab = { name: string; weight: number }
const criteriaTabs: Tab[] = [
    { name: 'Not too\n important  ', weight: 1 },
    { name: 'Somewhat\n important', weight: 2 },
    { name: 'Fairly\n important', weight: 3 },
    { name: 'Super\n important', weight: 4 },
]

interface CriteriaSelectTabsProps {
    registerName: string
}
export const CriteriaSelectTabs: FC<CriteriaSelectTabsProps> = ({
    registerName,
}: CriteriaSelectTabsProps) => {
    const { getValues, setValue } = useFormContext()
    const [selected, setSelected] = useState<Tab>()
    const isMobile = useMediaQuery('(max-width: 965px)')

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
                    : 'items-center p-4 space-x-4'
            } overflow-scroll w-full bg-white dark:bg-neutralDark-500 rounded-2xl custom-box-shadow`}
        >
            {criteriaTabs.map(item => (
                <div
                    key={`criteria-select-tabs-${item.name}`}
                    className={`${bodyHeavy} ${
                        isMobile ? 'w-full' : ''
                    } flex items-center justify-center py-2 px-8 text-center cursor-pointer bg-white dark:bg-neutralDark-300 rounded-lg  ${
                        selected?.name === item.name
                            ? 'text-white bg-primary dark:bg-primaryDark'
                            : 'text-neutral-700 dark:text-neutral-300 '
                    }`}
                    onClick={() => handleClick(item)}
                >
                    {item.name}
                </div>
            ))}
        </div>
    )
}
