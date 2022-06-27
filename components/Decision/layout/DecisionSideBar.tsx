import { UilArrowRight, UilCheck } from '@iconscout/react-unicons'
import { FC, useEffect, useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'

import useMediaQuery from '../../../hooks/useMediaQuery'
import { useAppSelector } from '../../../hooks/useRedux'
import { bodyHeavy } from '../../../styles/typography'
import { decisionSideBarOptions } from '../../../utils/constants/global'
import { Criteria, Options, TabItem } from '../../../utils/types/global'

interface DecisionSideBarProps {
    className?: string
    selectedTab: number
    setSelectedTab: (n: number) => void
}

export const DecisionSideBar: FC<DecisionSideBarProps> = ({
    className,
    selectedTab,
    setSelectedTab,
}: DecisionSideBarProps) => {
    const isMobile = useMediaQuery('(max-width: 965px)')

    const previousIndex = useAppSelector(
        state => state.decisionSlice.previousIndex
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
                    ? 'p-2 justify-evenly mt-3 self-end w-full'
                    : 'flex-col justify-center items-center h-full'
            } ${className ? className : ''}`}
        >
            {decisionSideBarOptions.map((item, index) =>
                isMobile ? (
                    <MobileItem
                        key={`side-bar-title-${item.title}-mobile`}
                        index={index}
                        item={item}
                        selectedTab={selectedTab}
                        setSelectedTab={setSelectedTab}
                        pointerArray={pointerArray}
                    />
                ) : (
                    <DesktopItem
                        key={`side-bar-title-${item.title}-desktop`}
                        index={index}
                        item={item}
                        selectedTab={selectedTab}
                        setSelectedTab={setSelectedTab}
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
            className={`flex items-center pl-3 w-full ${
                pointerArray[item.tab - 1] ? 'cursor-pointer' : 'cursor-default'
            } ${index < 1 && 'pointer-events-none opacity-75'}`}
            onClick={() => {
                if (item.tab !== selectedTab && pointerArray[item.tab - 1]) {
                    setSelectedTab(item.tab)
                }
            }}
        >
            <div
                className={`${bodyHeavy} ${
                    selectedTab === index + 1 || index + 1 < selectedTab
                        ? 'text-primary dark:text-white bg-white dark:bg-primaryDark border-primary/50'
                        : 'bg-[#E2D9FC] dark:bg-neutralDark-150 text-neutral-700 dark:text-neutralDark-300 font-normal border-transparent'
                } flex items-center justify-center w-7 h-7 rounded-full border`}
            >
                {index + 1 < selectedTab ? (
                    <UilCheck
                        className={
                            'fill-primary dark:fill-white stroke-primary dark:stroke-white stroke-2'
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
                        ? 'text-white dark:text-neutralDark-50 font-normal'
                        : 'text-neutral-300 font-normal dark:text-neutralDark-150'
                }  mx-2 truncate`}
            >
                {item.title}
            </span>
            {selectedTab === index + 1 ? (
                <div className="justify-self-end ml-auto w-1.5 h-full bg-[#E2D9FC] dark:bg-primaryDark rounded" />
            ) : (
                ''
            )}
        </div>
        {item.tab !== 5 ? (
            <div
                className={`relative justify-self-start mr-auto ml-6 w-[2px] h-16  ${
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
            className={`flex flex-col justify-center items-center w-fit ${
                pointerArray[item.tab - 1] ? 'cursor-pointer' : 'cursor-default'
            } ${index < 1 && 'pointer-events-none opacity-75'}`}
            onClick={() => {
                if (item.tab !== selectedTab && pointerArray[item.tab - 1]) {
                    setSelectedTab(item.tab)
                }
            }}
        >
            <div
                className={`${bodyHeavy} ${
                    selectedTab === index + 1 || index + 1 < selectedTab
                        ? 'text-primary dark:text-white bg-white dark:bg-primaryDark border-primary/50'
                        : 'bg-[#E2D9FC] dark:bg-neutralDark-150 text-neutral-700 dark:text-neutralDark-300 font-normal border-transparent'
                } flex items-center justify-center w-7 h-7 rounded-full border mb-3 `}
            >
                {index + 1 < selectedTab ? (
                    <UilCheck
                        className={
                            'fill-primary dark:fill-white stroke-primary dark:stroke-white stroke-2'
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
                        ? 'text-white dark:text-neutralDark-50 font-normal'
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
                        ? 'fill-[#E2D9FC] dark:fill-white'
                        : 'fill-neutral-300'
                } mt-1`}
            />
        ) : (
            ''
        )}
    </>
)
