import { UilArrowRight, UilCheck } from '@iconscout/react-unicons'
import { FC, useEffect, useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'

import { setCurrentTab } from '../../../features/decision/decisionSlice'
import useMediaQuery from '../../../hooks/useMediaQuery'
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import { bodyHeavy } from '../../../styles/typography'
import { decisionSideBarOptions } from '../../../utils/constants/global'
import { Criteria, Options, TabItem } from '../../../utils/types/global'

interface DecisionSideBarProps {
    className?: string
}

export const DecisionSideBar: FC<DecisionSideBarProps> = ({
    className,
}: DecisionSideBarProps) => {
    const isMobile = useMediaQuery('(max-width: 965px)')

    const { previousIndex, currentTab } = useAppSelector(
        state => state.decisionSlice
    )
    const [pointerArray, setPointerArray] = useState([
        false,
        false,
        false,
        false,
        false,
    ])

    const { control } = useFormContext()
    const watchDecision = useWatch({ name: 'question', control })
    const watchOption = useWatch({ name: 'options', control })
    const watchCriteria = useWatch({ name: 'criteria', control })

    const validateDecision = () => {
        if (watchOption) {
            return true
        }
        return false
    }

    const validateOption = () => {
        let check = false
        watchOption.forEach((item: Options) => {
            if (item.name) {
                check = true
            }
        })
        return check
    }

    const validateCriteria = () => {
        let check = false
        watchCriteria.forEach((item: Criteria) => {
            if (item.name) {
                check = true
            }
        })
        return check
    }

    useEffect(() => {
        if (validateDecision() && validateOption() && validateCriteria()) {
            setPointerArray([true, true, true, true, true])
        } else {
            const newArray = [
                validateDecision(),
                validateOption(),
                validateCriteria(),
                false,
                false,
            ]
            newArray[previousIndex - 1] = true
            setPointerArray(newArray)
        }
    }, [watchDecision, watchOption, watchCriteria])

    return (
        <div
            className={`flex bg-primary dark:bg-neutralDark-300 ${
                isMobile
                    ? 'mt-3 w-full justify-evenly self-end p-2'
                    : 'h-full flex-col items-center justify-center'
            } ${className ? className : ''}`}
        >
            {decisionSideBarOptions.map((item, index) =>
                isMobile ? (
                    <MobileItem
                        key={`side-bar-title-${item.title}-mobile`}
                        index={index}
                        item={item}
                        selectedTab={currentTab}
                        setSelectedTab={(n: number) =>
                            useAppDispatch(setCurrentTab(n))
                        }
                        pointerArray={pointerArray}
                    />
                ) : (
                    <DesktopItem
                        key={`side-bar-title-${item.title}-desktop`}
                        index={index}
                        item={item}
                        selectedTab={currentTab}
                        setSelectedTab={(n: number) =>
                            useAppDispatch(setCurrentTab(n))
                        }
                        pointerArray={pointerArray}
                    />
                )
            )}
        </div>
    )
}

interface ItemProps {
    item: TabItem
    index: number
    selectedTab: number
    setSelectedTab: (n: number) => void
    pointerArray: boolean[]
}

const DesktopItem = ({
    item,
    index,
    selectedTab,
    setSelectedTab,
    pointerArray,
}: ItemProps) => (
    <>
        <div
            id={`decisionSideBar-${item.title}`}
            className={`flex w-full items-center pl-3 ${
                pointerArray[item.tab - 1] ? 'cursor-pointer' : 'cursor-default'
            }`}
            onClick={() => {
                if (item.tab !== selectedTab && pointerArray[item.tab - 1]) {
                    setSelectedTab(item.tab)
                }
            }}
        >
            <div
                className={`${bodyHeavy} ${
                    selectedTab === index + 1 || index + 1 < selectedTab
                        ? 'border-primary/50 bg-white text-primary dark:bg-primaryDark dark:text-white'
                        : 'border-transparent bg-[#E2D9FC] font-normal text-neutral-700 dark:bg-neutralDark-150 dark:text-neutralDark-300'
                } flex h-7 w-7 items-center justify-center rounded-full border`}
            >
                {index + 1 < selectedTab ? (
                    <UilCheck
                        className={
                            'fill-primary stroke-primary stroke-2 dark:fill-white dark:stroke-white'
                        }
                    />
                ) : (
                    item.tab
                )}
            </div>
            <span
                className={`${bodyHeavy} ${
                    selectedTab === index + 1
                        ? 'text-white'
                        : index + 1 < selectedTab
                        ? 'font-normal text-white dark:text-neutralDark-50'
                        : 'font-normal text-neutral-300 dark:text-neutralDark-150'
                }  mx-2 truncate`}
            >
                {item.title}
            </span>
            {selectedTab === index + 1 ? (
                <div className="ml-auto h-full w-1.5 justify-self-end rounded bg-[#E2D9FC] dark:bg-primaryDark" />
            ) : (
                ''
            )}
        </div>
        {item.tab !== 5 ? (
            <div
                className={`relative mr-auto ml-6 h-16 w-[2px] justify-self-start  ${
                    index < selectedTab
                        ? 'bg-[#E2D9FC] dark:bg-white'
                        : 'bg-neutral-300 '
                }`}
            />
        ) : (
            ''
        )}
    </>
)

const MobileItem = ({
    item,
    index,
    selectedTab,
    setSelectedTab,
    pointerArray,
}: ItemProps) => (
    <>
        <div
            className={`flex w-fit flex-col items-center justify-center ${
                pointerArray[item.tab - 1] ? 'cursor-pointer' : 'cursor-default'
            }`}
            onClick={() => {
                if (item.tab !== selectedTab && pointerArray[item.tab - 1]) {
                    setSelectedTab(item.tab)
                }
            }}
        >
            <div
                className={`${bodyHeavy} ${
                    selectedTab === index + 1 || index + 1 < selectedTab
                        ? 'border-primary/50 bg-white text-primary dark:bg-primaryDark dark:text-white'
                        : 'border-transparent bg-[#E2D9FC] font-normal text-neutral-700 dark:bg-neutralDark-150 dark:text-neutralDark-300'
                } mb-3 flex h-7 w-7 items-center justify-center rounded-full border `}
            >
                {index + 1 < selectedTab ? (
                    <UilCheck
                        className={
                            'fill-primary stroke-primary stroke-2 dark:fill-white dark:stroke-white'
                        }
                    />
                ) : (
                    item.tab
                )}
            </div>
            <span
                className={`${bodyHeavy} ${
                    selectedTab === index + 1
                        ? 'text-white'
                        : index + 1 < selectedTab
                        ? 'font-normal text-white dark:text-neutralDark-50'
                        : 'font-normal text-neutral-300'
                } truncate`}
            >
                {item.title}
            </span>
        </div>
        {item.tab !== 5 ? (
            <UilArrowRight
                className={`${
                    index + 1 < selectedTab
                        ? 'fill-[#E2D9FC] dark:fill-white'
                        : 'fill-neutral-300'
                } mt-1`}
            />
        ) : (
            ''
        )}
    </>
)
