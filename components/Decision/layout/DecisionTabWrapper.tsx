import { FC } from 'react'
import { useFormContext } from 'react-hook-form'

import useMediaQuery from '../../../hooks/useMediaQuery'
import { useAppSelector } from '../../../hooks/useRedux'
import { bodyHeavy } from '../../../styles/typography'

interface DecisionTabWrapperProps {
    className?: string
    title: string
    currentTab: number
    children: JSX.Element | JSX.Element[]
}

export const DecisionTabWrapper: FC<DecisionTabWrapperProps> = ({
    className,
    title,
    currentTab,
    children,
}: DecisionTabWrapperProps) => {
    const { getValues } = useFormContext()
    const isMobile = useMediaQuery('(max-width: 965px)')

    const bestOption = useAppSelector(
        state => state.decisionSlice.decisionEngineBestOption
    )
    const optionIndex = useAppSelector(
        state => state.decisionSlice.decisionEngineOptionTab
    )

    const containerClass = `flex flex-col space-y-xl ${
        isMobile ? `${currentTab !== 4 ? 'mt-0' : 'mt-5'}` : 'mt-10'
    } w-full overflow-y-auto ${currentTab === 4 ? 'h-[50vh]' : 'h-[60vh]'} ${
        className ? className : ''
    }`

    return (
        <div className={containerClass}>
            <h3
                className={`${
                    isMobile ? bodyHeavy : ' text-2xl font-bold '
                }text-neutral-700 dark:text-neutralDark-150 capitalize`}
            >
                {title}
                {currentTab === 5 && bestOption && (
                    <span className="text-primary dark:text-primaryDark">
                        {' '}
                        {bestOption}
                    </span>
                )}
                {currentTab === 4 && (
                    <span className="text-neutral-700 dark:text-neutralDark-150">
                        Rate{' '}
                        <span className="text-primary dark:text-primaryDark capitalize">
                            {getValues('options')[optionIndex]?.name}
                        </span>{' '}
                        on each criteria.
                    </span>
                )}
            </h3>
            {children}
        </div>
    )
}
