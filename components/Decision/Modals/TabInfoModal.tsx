import { UilQuestionCircle } from '@iconscout/react-unicons'
import React from 'react'

import { setInfoModal } from '../../../features/decision/decisionSlice'
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import Modal from '../../Utils/Modal'

export const TabInfoModal = () => {
    const { isInfoModal, infoModalDetails, currentTab, matrixStep } =
        useAppSelector(state => state.decisionSlice)
    return (
        <Modal
            show={isInfoModal}
            onClose={() => useAppDispatch(setInfoModal(!isInfoModal))}
            className="md:w-[40%]"
        >
            <div className="flex flex-col space-y-4 p-2 md:p-4">
                <span
                    className={`flex items-center space-x-2 font-normal capitalize leading-6 text-sm tracking-normal md:text-base`}
                >
                    <UilQuestionCircle />
                    <b>
                        {currentTab === 0
                            ? infoModalDetails.title.split('/')[matrixStep]
                            : infoModalDetails.title}
                    </b>
                </span>
                <span
                    className={`text-left font-normal leading-6 text-sm tracking-normal md:text-base`}
                >
                    {infoModalDetails.context}
                </span>
            </div>
        </Modal>
    )
}
