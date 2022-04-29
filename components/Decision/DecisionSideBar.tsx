import { FC } from 'react'
import { useFormContext } from 'react-hook-form'

import { warningTime } from '../../utils/constants/global'

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
    const {
        trigger,
        clearErrors,
        formState: { errors },
    } = useFormContext()

    const validationHandler = async (tab: number) => {
        if (tab === 1) {
            await trigger(['question', 'context'])
            if (errors?.['question']?.message || errors?.['context']?.message) {
                setTimeout(
                    () => clearErrors(['question', 'context']),
                    warningTime
                )
                return false
            }
        }
        if (tab === 2) {
            await trigger(['options'])
            if (errors?.options && errors?.options.length) {
                setTimeout(() => clearErrors(['options']), warningTime)
                return false
            }
        }
        if (tab === 3) {
            await trigger(['criteria'])
            if (errors?.criteria && errors?.criteria.length) {
                setTimeout(() => clearErrors(['criteria']), warningTime)
                return false
            }
        }
        return true
    }

    const validateArray = async (tab: number) => {
        const isValid: boolean[] = [true, true, true, true, true]
        for (let i = 1; i < tab; i++) {
            const res = await validationHandler(i)
            isValid[i - 1] = res
        }
        return isValid
    }

    const onSelectItem = async (tab: number) => {
        const isValid: boolean[] = await validateArray(tab)
        let ArrayIsValid = true
        isValid.map(item => {
            if (item === false) {
                ArrayIsValid = false
            }
        })
        if (ArrayIsValid) {
            setSelectedTab(tab)
        }
    }

    return (
        <div
            className={`flex flex-col space-y-2 w-3/4 h-full ${
                className ? className : ''
            }`}
        >
            {DecisionSideBarOptions.map(item => (
                <div
                    key={item.tab}
                    style={{
                        background:
                            selectedTab === item.tab ? '#7269FF' : '#8E87FF',
                        borderTopRightRadius: '8px',
                        borderBottomRightRadius: '8px',
                    }}
                    className={`flex items-center py-3 px-3 transition-all  ${
                        selectedTab === item.tab
                            ? 'w-4/5'
                            : 'w-3/5 cursor-pointer'
                    }`}
                    onClick={() => {
                        if (item.tab !== selectedTab) {
                            onSelectItem(item.tab)
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
