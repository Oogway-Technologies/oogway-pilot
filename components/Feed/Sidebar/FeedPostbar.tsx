import { UilBalanceScale, UilImagePlus } from '@iconscout/react-unicons'
import React, { ChangeEvent, useRef } from 'react'

import {
    setCompareFormExpanded,
    setFileSizeTooLarge,
    setImageToPost,
} from '../../../features/utils/utilsSlice'
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import { postFormClass } from '../../../styles/feed'
import { checkFileSize } from '../../../utils/helpers/common'
import preventDefaultOnEnter from '../../../utils/helpers/preventDefaultOnEnter'

const FeedPostbar = ({ openModal }: { openModal: () => void }) => {
    const {
        compareForm: { compareFormExpanded },
    } = useAppSelector(state => state.utilsSlice)

    const filePickerRef = useRef<HTMLInputElement>(null)

    const handleCompareClick = () => {
        useAppDispatch(setCompareFormExpanded(!compareFormExpanded))
        openModal()
    }
    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        if (checkFileSize(e.target.files)) {
            const reader = new FileReader()
            const { target } = e
            if (!target) {
                return
            }
            // Extract file if it exists and read it
            const file = (target?.files && target?.files[0]) ?? null
            if (file) {
                reader.readAsDataURL(file)
            }
            // Reader is async, so use onload to attach a function
            // to set the loaded image from the reader
            reader.onload = readerEvent => {
                useAppDispatch(setImageToPost(readerEvent?.target?.result))
            }
        } else {
            useAppDispatch(setFileSizeTooLarge(true))
        }
        openModal()
    }

    return (
        <div className="mb-5 flex w-full items-center">
            <input
                placeholder={`What’s your question?`}
                className={
                    'w-full rounded-3xl border-2 border-solid border-neutral-300 bg-transparent py-3 px-4 text-sm focus-within:border-primary focus:border-primary focus:outline-none focus-visible:border-primary active:border-neutral-300'
                }
                onClick={event => {
                    event.stopPropagation()
                    openModal()
                }}
                value={''}
                readOnly
            />
            <div className={'ml-2 flex items-center'}>
                {/* Upload Image */}
                <button
                    onClick={() => filePickerRef?.current?.click()}
                    className={postFormClass.imageButton}
                >
                    <UilImagePlus />
                    <input
                        ref={filePickerRef}
                        onChange={handleImageUpload}
                        type="file"
                        accept="image/*"
                        onKeyPress={preventDefaultOnEnter}
                        hidden
                    />
                </button>
                {/* Trigger compare */}
                <button
                    onClick={handleCompareClick}
                    className={postFormClass.imageButton}
                    aria-expanded={compareFormExpanded}
                    aria-label="poll"
                >
                    <UilBalanceScale />
                </button>
            </div>
        </div>
    )
}

export default FeedPostbar
