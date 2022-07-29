import { UilHistory } from '@iconscout/react-unicons'
import React, { Fragment, useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'

import {
    setClickedConnect,
    setCurrentTab,
    setDecisionActivityId,
    setDecisionEngineOptionTab,
    setDecisionHistoryModal,
    setDecisionQuestion,
    setDecisionRatingUpdate,
    setIsDecisionRehydrated,
    setIsQuestionSafeForAI,
    setPreviousIndex,
    setSideCardStep,
    setUserIgnoredUnsafeWarning,
    updateDecisionFormState,
    updateFormCopy,
} from '../../../features/decision/decisionSlice'
import useIntersectionObserver from '../../../hooks/useIntersectionObserver'
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import { useInfiniteDecisionsQuery } from '../../../queries/decisionActivity'
import { deepCopy } from '../../../utils/helpers/common'
import { FirebaseDecisionActivity } from '../../../utils/types/firebase'
import {
    GenerateNotificationLoaders,
    NotificationLoader,
} from '../../Header/Notifications/NotificationLoaders'
import Modal from '../../Utils/Modal'
import { BaseCard } from '../common/BaseCard'

export const DecisionHistoryModal = () => {
    const { decisionHistoryModal, currentTab } = useAppSelector(
        state => state.decisionSlice
    )
    const {
        user: { uid },
    } = useAppSelector(state => state.userSlice)
    const { setValue, getValues } = useFormContext()
    const [showComplete, setShowComplete] = useState<boolean>(false)

    const { status, data, isFetchingNextPage, fetchNextPage, hasNextPage } =
        useInfiniteDecisionsQuery(uid, showComplete, decisionHistoryModal)

    // Instantiate intersection observer
    const loadMoreRef = useRef<HTMLDivElement>(null)
    useIntersectionObserver({
        threshold: 0.3,
        target: loadMoreRef,
        onIntersect: fetchNextPage,
        enabled: !!hasNextPage,
    })

    // Handler functions
    const showCompleteDecisions = () => {
        setShowComplete(true)
    }
    const showIncompleteDecisions = () => {
        setShowComplete(false)
    }

    const onHandleSelect = (decision: FirebaseDecisionActivity) => {
        // Create copies
        const decisionCopy = deepCopy(decision)

        // Set rehydration flags
        useAppDispatch(setIsDecisionRehydrated(true))
        // remove extra fields
        const extraFields = [
            'timestamp',
            'currentTab',
            'id',
            'userId',
            'isComplete',
            'ipAddress',
        ]
        for (const field of extraFields) {
            delete decisionCopy[field]
        }
        const formState: FirebaseDecisionActivity = {
            id: decision.id,
        }
        for (const [key, value] of Object.entries(
            decisionCopy as FirebaseDecisionActivity
        )) {
            if (key !== 'clickedConnect') {
                setValue(key, deepCopy(value), {
                    shouldValidate: true,
                    shouldDirty: true,
                })
            }
            formState[key] = deepCopy(value)
        }
        const {
            question,
            clickedConnect,
            userIgnoredUnsafeWarning,
            isQuestionSafeForAI,
        } = decisionCopy

        // Set form state in redux
        useAppDispatch(setDecisionActivityId(decision.id))
        useAppDispatch(setDecisionQuestion(question))
        useAppDispatch(setClickedConnect(clickedConnect))
        useAppDispatch(setUserIgnoredUnsafeWarning(userIgnoredUnsafeWarning))
        useAppDispatch(setIsQuestionSafeForAI(isQuestionSafeForAI))
        useAppDispatch(updateDecisionFormState(formState))

        if (clickedConnect) {
            useAppDispatch(setSideCardStep(2))
        }
        // update current tab
        if (decision.currentTab && !decision.isComplete) {
            // Needed for forward compatibility of decisions made prior to us
            // switching the order of entering options and criteria.
            if (!('criteria' in decision)) {
                useAppDispatch(setCurrentTab(2))
            } else {
                useAppDispatch(setCurrentTab(decision.currentTab))
            }
            if (currentTab === 4) useAppDispatch(setDecisionRatingUpdate(true))
        }

        if (decision.isComplete) {
            useAppDispatch(setPreviousIndex(4))
            useAppDispatch(setCurrentTab(5))
            useAppDispatch(setDecisionEngineOptionTab(0))
        }

        useAppDispatch(
            updateFormCopy(
                deepCopy({
                    question: getValues('question'),
                    context: getValues('context'),
                    options: getValues('options'),
                    criteria: getValues('criteria'),
                })
            )
        )
        useAppDispatch(setDecisionHistoryModal(false))
    }

    return (
        <Modal
            show={decisionHistoryModal}
            onClose={() =>
                useAppDispatch(setDecisionHistoryModal(!decisionHistoryModal))
            }
            className="!p-3 md:w-[60%] md:!p-5"
        >
            <div className="flex flex-col space-y-2 p-2 md:space-y-4 md:p-4">
                <span
                    className={`flex items-center space-x-2 font-normal capitalize leading-6 text-sm tracking-normal md:text-base`}
                >
                    <UilHistory />
                    <b>Decision History</b>
                </span>
                <span
                    className={`flex items-center text-neutral-700 text-sm dark:text-neutralDark-150 md:text-base`}
                >
                    You can view the results of a past decision or return to an
                    incomplete decision.
                </span>
                <div className="flex w-full items-center space-x-2 md:space-x-4">
                    <BaseCard className="flex w-full flex-col space-y-4 p-2.5 dark:bg-neutralDark-300 md:p-5">
                        <div className="inline-flex">
                            <button
                                onClick={showIncompleteDecisions}
                                className={` ${
                                    !showComplete
                                        ? 'bg-tertiary '
                                        : 'bg-transparent '
                                } w-1/2 rounded-2xl px-md py-xs font-bold text-primary text-sm focus:outline-none dark:text-primaryDark md:px-lg md:py-sm md:text-base`}
                            >
                                Incomplete
                            </button>
                            <button
                                onClick={showCompleteDecisions}
                                className={` ${
                                    showComplete
                                        ? 'bg-tertiary '
                                        : 'bg-transparent '
                                } w-1/2 rounded-2xl px-md py-xs font-bold text-primary text-sm focus:outline-none dark:text-primaryDark md:px-lg md:py-sm md:text-base `}
                            >
                                Complete
                            </button>
                        </div>
                        <div
                            className={
                                'flex h-[23rem] w-full flex-col space-y-4 overflow-y-auto px-3 snap-proximity ' +
                                'scrollbar scrollbar-sm scrollbar-rounded scrollbar-thumb-tertiary ' +
                                'scrollbar-track-neutral-50 dark:scrollbar-thumb-primaryDark dark:scrollbar-track-neutralDark-300'
                            }
                        >
                            {status === 'loading' ? (
                                <GenerateNotificationLoaders n={3} />
                            ) : status === 'error' ? (
                                <div>Error loading decisions</div>
                            ) : (
                                <Fragment>
                                    {/* Infinite scroller / lazy loader */}
                                    {data?.pages.map(page => (
                                        <Fragment
                                            key={page?.lastTimestamp?.seconds}
                                        >
                                            {/* If notifications exist */}
                                            {page.decisions?.length > 0 &&
                                                page.decisions.map(
                                                    (
                                                        decision: FirebaseDecisionActivity
                                                    ) => (
                                                        <BaseCard
                                                            onClick={() =>
                                                                onHandleSelect(
                                                                    decision
                                                                )
                                                            }
                                                            className="cursor-pointer !rounded-lg p-2 md:p-4"
                                                            key={decision.id}
                                                        >
                                                            <span
                                                                className={
                                                                    'text-clip break-words font-bold text-neutral-700 text-sm dark:text-neutralDark-150 md:text-base'
                                                                }
                                                            >
                                                                {
                                                                    decision.question
                                                                }
                                                            </span>
                                                        </BaseCard>
                                                    )
                                                )}
                                        </Fragment>
                                    ))}

                                    {/* Lazy loaader sentinel and end of decisions */}
                                    {isFetchingNextPage || hasNextPage ? (
                                        <NotificationLoader ref={loadMoreRef} />
                                    ) : data?.pages[0].decisions &&
                                      data?.pages[0].decisions.length === 0 ? (
                                        <span className="mx-auto text-center text-neutral-700 text-base dark:text-neutral-100">
                                            {`No ${
                                                showComplete
                                                    ? 'Complete'
                                                    : 'Incomplete'
                                            } decisions`}
                                        </span>
                                    ) : (
                                        <></>
                                    )}
                                </Fragment>
                            )}
                        </div>
                    </BaseCard>
                </div>
            </div>
        </Modal>
    )
}
