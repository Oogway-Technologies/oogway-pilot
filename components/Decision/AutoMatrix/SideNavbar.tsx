import { UilBalanceScale, UilTrophy } from '@iconscout/react-unicons'
import React, { FC } from 'react'
import { useFormContext } from 'react-hook-form'

import useMediaQuery from '../../../hooks/useMediaQuery'
import { bodyHeavy } from '../../../styles/typography'

interface SideNavbarProps {
    className?: string
    selectedTab: number
    setSelectedTab: (n: number) => void
}

const Tabs = [
    {
        title: 'Decision',
        icon: (selectedTab: number, index: number) => (
            <UilBalanceScale
                className={`min-h-[1.25rem] min-w-[1.25rem] ${
                    selectedTab === index ? 'fill-white' : 'fill-[#C2B2EF]'
                }`}
            />
        ),
    },
    {
        title: 'Result',
        icon: (selectedTab: number, index: number) => (
            <UilTrophy
                className={`min-h-[1.25rem] min-w-[1.25rem] ${
                    selectedTab === index ? 'fill-white' : 'fill-[#C2B2EF]'
                }`}
            />
        ),
    },
]

export const SideNavbar: FC<SideNavbarProps> = ({
    className,
    selectedTab,
    setSelectedTab,
}: SideNavbarProps) => {
    const isMobile = useMediaQuery('(max-width: 965px)')
    const { getValues } = useFormContext()

    return (
        <div
            className={`flex bg-primary dark:bg-neutralDark-300 ${
                isMobile
                    ? 'mt-3 w-full justify-evenly self-end p-2'
                    : 'h-full flex-col items-center justify-center'
            } ${className ? className : ''}`}
        >
            {Tabs.map((item, index) => (
                <div
                    onClick={() => {
                        if (getValues('options').length > 1) {
                            setSelectedTab(index)
                        }
                    }}
                    className={`flex ${
                        isMobile ? 'flex-col items-center' : 'items-center '
                    } h-12 w-full pl-3 ${
                        index === 1 && getValues('options').length > 1
                            ? 'cursor-pointer'
                            : index === 0
                            ? 'cursor-pointer'
                            : ''
                    } `}
                    key={`auto-matrix-${index}`}
                >
                    {item.icon(selectedTab, index)}
                    <span
                        className={`${bodyHeavy} ${
                            isMobile ? '' : 'ml-3'
                        } truncate ${
                            selectedTab === index
                                ? 'text-white'
                                : 'text-[#C2B2EF]'
                        }`}
                    >
                        {item.title}
                    </span>
                    {!isMobile && (
                        <div
                            className={`ml-auto h-full w-[4px] ${
                                selectedTab === index
                                    ? 'bg-[#E2D9FC] dark:bg-white'
                                    : ''
                            } rounded`}
                        />
                    )}
                </div>
            ))}
        </div>
    )
}
