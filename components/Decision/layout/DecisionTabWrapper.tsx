import { FC, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'

import {
    setCurrentTab,
    setDecisionRatingUpdate,
} from '../../../features/decision/decisionSlice'
import useMediaQuery from '../../../hooks/useMediaQuery'
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import { useCreateDecisionActivity } from '../../../queries/decisionActivity'
import { feedToolbarClass } from '../../../styles/feed'
import { bodyHeavy } from '../../../styles/typography'
import { deepCopy } from '../../../utils/helpers/common'
import { findInCriteria, findInOption } from '../../../utils/helpers/decision'
import { Criteria, Options, Rating, Ratings } from '../../../utils/types/global'
import { WrapperTabMenu } from '../common/WrapperTabMenu'
import { QuestionHelperCard } from '../SideCards/QuestionHelperCard'

interface DecisionTabWrapperProps {
    className?: string
    title: string
    currentTab: number
    matrixStep: number
    children: JSX.Element | JSX.Element[]
}

export const DecisionTabWrapper: FC<DecisionTabWrapperProps> = ({
    className,
    title,
    currentTab,
    matrixStep,
    children,
}: DecisionTabWrapperProps) => {
    const isMobile = useMediaQuery('(max-width: 965px)')
    const {
        decisionCriteriaQueryKey,
        decisionRatingUpdate,
        decisionActivityId,
        decisionMatrixHasResults,
    } = useAppSelector(state => state.decisionSlice)
    const createOrUpdateDecision = useCreateDecisionActivity()
    const { getValues, setValue } = useFormContext()

    useEffect(() => {
        let orgOptionsList = getValues('options')
        let orgCriteriaList = getValues('criteria')
        if ([4, 5].includes(currentTab)) {
            orgCriteriaList = orgCriteriaList.filter(
                (item: Criteria) => item.name
            )
            orgOptionsList = orgOptionsList.filter((item: Options) => item.name)
            setValue('options', orgOptionsList)
            setValue('criteria', orgCriteriaList)
        }

        if (decisionRatingUpdate || [2, 3, 4, 5].includes(currentTab)) {
            const mapRatingObject: Ratings[] = []
            const reShapeCriteriaList: Rating[] = []

            orgCriteriaList.forEach(
                (item: { name: string; weight: number }) => {
                    reShapeCriteriaList.push({
                        criteria: item.name,
                        value: 1,
                        weight: item.weight,
                    })
                }
            )
            orgOptionsList.forEach((item: { name: string }) => {
                mapRatingObject.push({
                    option: item.name,
                    rating: reShapeCriteriaList,
                })
            })
            const existingRating: Ratings[] = getValues('ratings')
            if (existingRating.length) {
                mapRatingObject.forEach((item, indx) => {
                    const isFound = findInOption(existingRating, item.option)
                    if (isFound) {
                        const newRating: Rating[] = []
                        item.rating.forEach((ctr, idx) => {
                            const isFoundCriteria = findInCriteria(
                                existingRating[isFound.index].rating,
                                ctr.criteria
                            )
                            if (isFoundCriteria) {
                                newRating.push(
                                    deepCopy({
                                        criteria:
                                            mapRatingObject[indx].rating[idx]
                                                .criteria,
                                        value: isFoundCriteria.value,
                                        weight: mapRatingObject[indx].rating[
                                            idx
                                        ].weight,
                                    })
                                )
                            } else {
                                newRating.push(ctr)
                            }
                        })
                        mapRatingObject[indx].rating = [...newRating]
                    }
                })
            }
            setValue('ratings', mapRatingObject)
            useAppDispatch(setDecisionRatingUpdate(false))
        }
    }, [currentTab])

    const heightDecider = (tab: number) => {
        switch (tab) {
            case 0:
                return 'h-[calc(100vh-15rem)]'
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
                  currentTab === 4
                      ? 'h-[calc(100vh-31.15rem)]'
                      : currentTab === 0
                      ? 'h-[calc(100vh-13.75rem)]'
                      : 'h-[calc(100vh-17.5rem)]'
              }`
    } mt-0 w-full overflow-y-auto ${className ? className : ''}`

    const handleRefineDecision = () => {
        // update previous decision
        createOrUpdateDecision.mutate({
            id: decisionActivityId,
            isComplete: false,
            currentTab: 2,
        })
        useAppDispatch(setCurrentTab(2))
    }

    return (
        <div className={containerClass}>
            {!isMobile && currentTab !== 4 && (
                <QuestionHelperCard title={title} />
            )}
            {currentTab !== 5 ? (
                <h3
                    className={`${
                        isMobile ? bodyHeavy : 'font-bold text-2xl'
                    } flex items-center whitespace-nowrap capitalize text-neutral-800 dark:text-white ${
                        [2, 3].includes(currentTab)
                            ? `sticky top-[-2px] z-50 pb-2 ${
                                  isMobile
                                      ? 'bg-neutral-25 dark:bg-neutralDark-600'
                                      : 'bg-white dark:bg-neutralDark-500'
                              }`
                            : ''
                    } ${currentTab === 0 ? '!mt-6' : ''}`}
                >
                    {currentTab === 0 ? title.split('/')[matrixStep] : title}
                    {isMobile && <WrapperTabMenu title={title} />}
                    {!isMobile &&
                        decisionMatrixHasResults &&
                        currentTab === 0 &&
                        matrixStep === 1 && (
                            <button
                                id={'automatedDecisionMatrix-RefineDecision'}
                                className={`${feedToolbarClass.newPostButton} ml-auto !text-base`}
                                onClick={handleRefineDecision}
                            >
                                Refine decision
                            </button>
                        )}
                </h3>
            ) : null}
            {children}
        </div>
    )
}
