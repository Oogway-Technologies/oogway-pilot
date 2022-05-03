import { FC, useEffect, useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'

import useMediaQuery from '../../hooks/useMediaQuery'
import { Criteria, Options } from '../../utils/types/global'

interface DecisionSideBarProps {
    className?: string
    selectedTab: number
    setSelectedTab: (v: number) => void
}

export const DecisionSideBarOptions: { title: string; tab: number }[] = [
    { title: 'Decision', tab: 1 },
    { title: 'Options', tab: 2 },
    { title: 'Criteria', tab: 3 },
    { title: 'Rating', tab: 4 },
    { title: 'Result', tab: 5 },
]

export const DecisionSideBar: FC<DecisionSideBarProps> = ({
    className,
    selectedTab,
    setSelectedTab,
}: DecisionSideBarProps) => {
    const { getValues } = useFormContext()
    const [pointerArray, setPointerArray] = useState([
        false,
        false,
        false,
        false,
        false,
    ])

    const watchDecision = useWatch({ name: 'question' })
    const watchOption = useWatch({ name: 'options' })
    const watchCriteria = useWatch({ name: 'criteria' })
    const isMobile = useMediaQuery('(max-width: 965px)')

    const validateDecision = () => {
        const question: string = getValues('question')
        if (question) {
            return true
        }
        return false
    }

    const validateOption = () => {
        const options = getValues('options')
        let check = false
        options.forEach((item: Options) => {
            if (item.name) {
                check = true
            }
        })

        return check
    }

    const validateCriteria = () => {
        const criteria = getValues('criteria')
        let check = false
        criteria.forEach((item: Criteria) => {
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
            setPointerArray([
                validateDecision(),
                validateOption(),
                validateCriteria(),
                false,
                false,
            ])
        }
    }, [watchDecision, watchOption, watchCriteria])

    return (
        <div
            className={`flex ${
                isMobile
                    ? 'space-x-2 mb-2 overflow-scroll w-[90vw] scrollbar-hide'
                    : 'flex-col space-y-2 w-3/4 h-full'
            } ${className ? className : ''}`}
        >
            {DecisionSideBarOptions.map(item => (
                <div
                    key={item.tab}
                    style={{
                        borderTopRightRadius: isMobile ? undefined : '8px',
                        borderBottomRightRadius: isMobile ? undefined : '8px',
                    }}
                    className={`flex items-center ${
                        isMobile
                            ? 'px-2 py-0 rounded-2xl justify-center'
                            : 'p-3'
                    } transition-all  ${
                        selectedTab === item.tab
                            ? `${
                                  isMobile ? 'w-full' : 'w-4/5'
                              } bg-primary/90 dark:bg-primaryDark/90`
                            : `${
                                  isMobile ? 'w-full' : 'w-3/5'
                              } bg-primary/60 dark:bg-primaryDark/60`
                    } ${
                        pointerArray[item.tab - 1]
                            ? 'cursor-pointer'
                            : 'cursor-default'
                    }`}
                    onClick={() => {
                        if (
                            item.tab !== selectedTab &&
                            pointerArray[item.tab - 1]
                        ) {
                            setSelectedTab(item.tab)
                        }
                    }}
                >
                    <span
                        className={`text-base text-white transition-all truncate ${
                            selectedTab === item.tab
                                ? 'font-bold'
                                : 'font-normal'
                        }`}
                    >
                        {item.title}
                    </span>
                </div>
            ))}
        </div>
    )
}
