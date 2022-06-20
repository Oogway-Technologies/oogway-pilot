import { UilBalanceScale, UilTrophy } from '@iconscout/react-unicons'
import React, { FC } from 'react'

import useMediaQuery from '../../../hooks/useMediaQuery'
import { bodyHeavy } from '../../../styles/typography'

interface SideNavbarProps {
    className?: string
    selectedTab: number
    setSelectedTab?: (n: number) => void
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
}: SideNavbarProps) => {
    const isMobile = useMediaQuery('(max-width: 965px)')

    return (
        <div
            className={`flex bg-primary dark:bg-neutralDark-300 ${
                isMobile
                    ? 'p-2 justify-evenly mt-3 self-end w-full'
                    : 'flex-col justify-center items-center h-full'
            } ${className ? className : ''}`}
        >
            {Tabs.map((item, index) => (
                <div
                    // onClick={() => setSelectedTab(index)}
                    className={`flex ${
                        isMobile
                            ? 'flex-col items-center space-x-3'
                            : 'items-center '
                    } pl-3 w-full h-12 cursor-pointer `}
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
                            className={`ml-auto w-[4px] h-full ${
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
