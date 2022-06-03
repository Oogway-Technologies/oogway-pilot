import { FC } from 'react'

import useMediaQuery from '../../../hooks/useMediaQuery'
import { useAppSelector } from '../../../hooks/useRedux'
import { bodyHeavy } from '../../../styles/typography'
// import { QuestionCard } from '../SideCards/QuestionCard'

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
    const isMobile = useMediaQuery('(max-width: 965px)')
    const { decisionCriteriaQueryKey } = useAppSelector(
        state => state.decisionSlice
    )

    // Handler functions
    const heightDecider = (tab: number) => {
        switch (tab) {
            case 1:
                return 'h-[calc(100vh-17.5rem)]'
            case 2:
                return 'h-[calc(100vh-16rem)]'
            case 3:
                return 'h-[calc(100vh-16rem)]'
            case 4:
                return decisionCriteriaQueryKey
                    ? 'h-[calc(100vh-23rem)]'
                    : isMobile
                    ? 'h-[50%]'
                    : 'h-[calc(100vh-23rem)]'

            case 5:
                return 'h-[calc(100vh-18rem)]'
            default:
                return 'h-[60vh]'
        }
    }

    const containerClass = `flex flex-col ${
        isMobile
            ? `${
                  currentTab !== 4 ? 'mt-0 space-y-md p-0.5' : 'mt-4'
              } ${heightDecider(currentTab)} `
            : `space-y-lg ${
                  currentTab !== 4
                      ? 'h-[calc(100vh-17.5rem)]'
                      : 'h-[calc(100vh-27.15rem)]'
              }`
    } mt-0 w-full overflow-y-auto ${className ? className : ''}`

    return (
        <div className={containerClass}>
            {/* {[2, 3].includes(currentTab) && !isMobile ? <QuestionCard /> : ''} */}
            {currentTab !== 5 ? (
                <h3
                    className={`${
                        isMobile ? bodyHeavy : 'text-2xl font-bold'
                    } text-neutral-800 dark:text-white capitalize ${
                        [2, 3].includes(currentTab)
                            ? `sticky top-[-2px] z-50 pb-2 ${
                                  isMobile
                                      ? 'dark:bg-neutralDark-600 bg-neutral-25'
                                      : 'dark:bg-neutralDark-500 bg-white'
                              }`
                            : ''
                    }
                    `}
                >
                    {title}
                </h3>
            ) : null}
            {children}
        </div>
    )
}
