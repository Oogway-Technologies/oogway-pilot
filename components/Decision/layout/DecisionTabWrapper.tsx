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
    const { decisionEngineBestOption, decisionEngineOptionTab } =
        useAppSelector(state => state.decisionSlice)

    const containerClass = `flex flex-col  ${
        isMobile
            ? `${currentTab !== 4 ? 'mt-0 space-y-md' : 'mt-4'}`
            : 'mt-10 space-y-xl'
    } w-full overflow-y-auto gap-y-sm ${className ? className : ''}`

    return (
        <div className={containerClass}>
            <h3
                className={`${
                    isMobile ? bodyHeavy : ' text-2xl font-bold '
                }text-neutral-800 dark:text-neutralDark-150 capitalize`}
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
