import { UilArrowLeft, UilArrowRight } from '@iconscout/react-unicons'
import { FC, useEffect, useState } from 'react'

import { squareButton } from '../../styles/decision'
import { ProgressBar } from '../Utils/common/ProgressBar'
import { DecisionSideBarOptions } from './DecisionSideBar'

interface DecisionBarHandlerProps {
    className?: string
    selectedTab: number
    setSelectedTab: (v: number) => void
}

export const DecisionBarHandler: FC<DecisionBarHandlerProps> = ({
    className,
    selectedTab,
    setSelectedTab,
}: DecisionBarHandlerProps) => {
    const [buttonType, setButtonType] = useState<'button' | 'submit'>('button')
    useEffect(() => {
        setButtonType(selectedTab === 4 ? 'submit' : 'button')
    }, [selectedTab])

    return (
        <div
            className={`flex items-center justify-between ${
                className ? className : ''
            }`}
        >
            <button
                className={`${squareButton} mr-auto`}
                type="button"
                onClick={() => {
                    if (selectedTab !== 1) {
                        setSelectedTab(selectedTab - 1)
                    }
                }}
            >
                <UilArrowLeft className="fill-neutral-700" />
            </button>
            <div className="w-3/6">
                <ProgressBar
                    currentStep={selectedTab}
                    totalSteps={DecisionSideBarOptions.length}
                    className="w-full"
                />
            </div>
            <button
                className={`${squareButton} ml-auto`}
                type={buttonType}
                onClick={() => {
                    if (selectedTab !== DecisionSideBarOptions.length) {
                        setSelectedTab(selectedTab + 1)
                    }
                }}
            >
                <UilArrowRight className="fill-neutral-700" />
            </button>
        </div>
    )
}
