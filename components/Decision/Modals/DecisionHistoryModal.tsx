import { UilHistory } from '@iconscout/react-unicons'
import React, { useEffect, useState } from 'react'
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
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import { getDecisionHistory } from '../../../queries/getDecisionHistory'
import { deepCopy } from '../../../utils/helpers/common'
import {
    DecisionFirebase,
    FirebaseDecisionActivity,
} from '../../../utils/types/firebase'
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
    const [completed, setCompleted] = useState<DecisionFirebase[]>([])
    const [inComplete, setInComplete] = useState<DecisionFirebase[]>([])

    useEffect(() => {
        getDecisionHistory(uid).then(({ complete, inComplete }) => {
            setCompleted(complete)
            setInComplete(inComplete)
        })
    }, [])

    const onHandleSelect = (decision: DecisionFirebase) => {
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
            useAppDispatch(setCurrentTab(decision.currentTab))
            if (currentTab === 4) useAppDispatch(setDecisionRatingUpdate(true))
        } else if (!decision.currentTab && !decision.isComplete) {
            setCurrentTab(1)
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
                    <BaseCard className="flex w-1/2 flex-col space-y-4 p-2.5 dark:bg-neutralDark-300 md:p-5">
                        <span
                            className={`font-bold text-primary text-sm dark:text-primaryDark md:text-base`}
                        >
                            Complete
                        </span>
                        <div className="flex h-[23rem] w-full flex-col space-y-4 overflow-y-scroll p-1.5">
                            {completed.length ? (
                                completed.map((item, idx) => (
                                    <BaseCard
                                        onClick={() => onHandleSelect(item)}
                                        className="cursor-pointer !rounded-lg p-2 md:p-4"
                                        key={`${item.id}-complete-item${idx}`}
                                    >
                                        <span
                                            className={
                                                'break-words font-bold text-neutral-700 text-sm dark:text-neutralDark-150 md:text-base'
                                            }
                                        >
                                            {item.question}
                                        </span>
                                    </BaseCard>
                                ))
                            ) : (
                                <span className="mx-auto text-center text-neutral-700 text-base dark:text-neutral-100">
                                    No Complete decisions
                                </span>
                            )}
                        </div>
                    </BaseCard>
                    <BaseCard className="flex w-1/2 flex-col space-y-4 p-2.5 dark:bg-neutralDark-300 md:p-5">
                        <span
                            className={
                                'font-bold text-primary text-sm dark:text-primaryDark md:text-base'
                            }
                        >
                            Incomplete
                        </span>
                        <div className="flex h-[23rem] w-full flex-col space-y-4 overflow-y-scroll p-1.5">
                            {inComplete.length ? (
                                inComplete.map((item, idx) => (
                                    <BaseCard
                                        onClick={() => onHandleSelect(item)}
                                        className="cursor-pointer !rounded-lg p-2 md:p-4"
                                        key={`${item.id}-incomplete-item${idx}`}
                                    >
                                        <span
                                            className={
                                                'text-clip break-words font-bold text-neutral-700 text-sm dark:text-neutralDark-150 md:text-base'
                                            }
                                        >
                                            {item.question}
                                        </span>
                                    </BaseCard>
                                ))
                            ) : (
                                <span className="mx-auto text-center text-neutral-700 text-base dark:text-neutral-100">
                                    No Incomplete decisions
                                </span>
                            )}
                        </div>
                    </BaseCard>
                </div>
            </div>
        </Modal>
    )
}