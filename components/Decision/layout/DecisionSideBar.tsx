import { UilArrowRight, UilCheck } from '@iconscout/react-unicons'
import { FC } from 'react'

import useMediaQuery from '../../../hooks/useMediaQuery'
import { bodyHeavy } from '../../../styles/typography'

interface TabItem {
    title: string
    tab: number
}
interface DecisionSideBarProps {
    className?: string
    selectedTab: number
}

export const decisionSideBarOptions: TabItem[] = [
    { title: 'Decision', tab: 1 },
    { title: 'Options', tab: 2 },
    { title: 'Criteria', tab: 3 },
    { title: 'Rating', tab: 4 },
    { title: 'Result', tab: 5 },
]

export const DecisionSideBar: FC<DecisionSideBarProps> = ({
    className,
    selectedTab,
}: DecisionSideBarProps) => {
    const isMobile = useMediaQuery('(max-width: 965px)')

    const desktopItem = (item: TabItem, index: number) => (
        <>
            <div
                key={`side-bar-title-${item.title}`}
                className="flex items-center pl-3 w-full"
            >
                <div
                    className={`${bodyHeavy} ${
                        selectedTab === index + 1 || index + 1 < selectedTab
                            ? 'text-primary bg-white border-primary/50'
                            : 'bg-[#E2D9FC] text-neutral-700 font-normal border-transparent'
                    } flex items-center justify-center w-7 h-7 rounded-full border`}
                >
                    {index + 1 < selectedTab ? (
                        <UilCheck className={'fill-primary'} />
                    ) : (
                        item.tab
                    )}
                </div>
                <span
                    className={`${bodyHeavy} ${
                        selectedTab === index + 1
                            ? 'text-white'
                            : 'text-neutral-300 font-normal'
                    }  mx-2 truncate`}
                >
                    {item.title}
                </span>
                {selectedTab === index + 1 ? (
                    <div className="justify-self-end ml-auto w-1 h-full bg-[#E2D9FC] rounded" />
                ) : (
                    ''
                )}
            </div>
            {item.tab !== 5 ? (
                <div
                    className={`relative justify-self-start mr-auto ml-6 w-[2px] h-16  ${
                        index < selectedTab ? 'bg-[#E2D9FC]' : 'bg-neutral-300'
                    }`}
                />
            ) : (
                ''
            )}
        </>
    )

    const mobileItem = (item: TabItem, index: number) => (
        <>
            <div
                key={`side-bar-title-${item.title}`}
                className="flex flex-col justify-center items-center w-fit"
            >
                <div
                    className={`${bodyHeavy} ${
                        selectedTab === index + 1 || index + 1 < selectedTab
                            ? 'text-primary bg-white border-primary/50'
                            : 'bg-[#E2D9FC] text-neutral-700 font-normal border-transparent'
                    } flex items-center justify-center w-7 h-7 rounded-full border  mb-3`}
                >
                    {index + 1 < selectedTab ? (
                        <UilCheck className={'fill-primary'} />
                    ) : (
                        item.tab
                    )}
                </div>
                <span
                    className={`${bodyHeavy} ${
                        selectedTab === index + 1
                            ? 'text-white'
                            : 'text-neutral-300 font-normal'
                    } truncate`}
                >
                    {item.title}
                </span>
            </div>
            {item.tab !== 5 ? (
                <UilArrowRight
                    className={`${
                        index + 1 < selectedTab
                            ? 'fill-[#E2D9FC]'
                            : 'fill-neutral-300'
                    } mt-1`}
                />
            ) : (
                ''
            )}
        </>
    )
    return (
        <div
            className={`flex ${
                isMobile
                    ? 'bg-primary p-2 justify-evenly sticky bottom-0 w-full'
                    : 'flex-col justify-center items-center bg-primary h-full'
            } ${className ? className : ''}`}
        >
            {decisionSideBarOptions.map((item, index) =>
                isMobile ? mobileItem(item, index) : desktopItem(item, index)
            )}
        </div>
    )
}
