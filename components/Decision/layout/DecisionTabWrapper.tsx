import { FC } from 'react'
import { useFormContext } from 'react-hook-form'

import useMediaQuery from '../../../hooks/useMediaQuery'
import { useAppSelector } from '../../../hooks/useRedux'
import { bodyHeavy } from '../../../styles/typography'
// import { QuestionCard } from '../Sidecards/QuestionCard'

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
    const {
        decisionEngineBestOption,
        decisionEngineOptionTab,
        decisionCriteriaQueryKey,
    } = useAppSelector(state => state.decisionSlice)

    const heightDecider = (tab: number) => {
        switch (tab) {
            case 1:
                return 'h-[calc(100vh-19.5rem)]'
            case 2:
                return 'h-[calc(100vh-17.5rem)]'
            case 3:
                return 'h-[calc(100vh-17.5rem)]'
            case 4:
                return decisionCriteriaQueryKey
                    ? 'h-[calc(100vh-25rem)]'
                    : isMobile
                    ? 'h-[calc(100vh-30.5rem)]'
                    : 'h-[calc(100vh-25rem)]'

            case 5:
                return 'h-[calc(100vh-20.5rem)]'
            default:
                return 'h-[60vh]'
        }
    }
    const containerClass = `flex flex-col ${
        isMobile
            ? `${currentTab !== 4 ? 'mt-0 space-y-md p-0.5' : 'mt-4'}`
            : 'space-y-lg'
    } ${
        [2, 3, 4].includes(currentTab) ? 'mt-0' : 'mt-10'
    } w-full overflow-y-auto ${heightDecider(currentTab)} ${
        currentTab === 5 ? '' : ''
    } ${className ? className : ''}`

    return (
        <div className={containerClass}>
            {/* {[2, 3].includes(currentTab) && !isMobile ? <QuestionCard /> : ''} */}
            <h3
                className={`${
                    isMobile ? bodyHeavy : 'text-2xl font-bold'
                } text-neutral-800 dark:text-white capitalize`}
            >
                {title}
                {currentTab === 5 && decisionEngineBestOption && (
                    <span className="text-primary dark:text-primaryDark">
                        {' '}
                        {decisionEngineBestOption}
                    </span>
                )}
                {currentTab === 4 && (
                    <span className="text-neutral-700 dark:text-neutralDark-150">
                        Rate{' '}
                        <span className="text-primary dark:text-primaryDark">
                            {
                                getValues('options')[decisionEngineOptionTab]
                                    ?.name
                            }
                        </span>{' '}
                        on each criteria.
                    </span>
                )}
            </h3>
            {children}
        </div>
    )
}
