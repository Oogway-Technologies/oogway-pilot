import { atom } from 'recoil'

import { compareFormOptions } from '../utils/types/global'

export const comparePostType = atom<compareFormOptions>({
    key: 'comparePostTypeState',
    default: 'textOnly',
})

export const compareFormExpanded = atom<boolean>({
    key: 'compareFormExpanded',
    default: false,
})

export const textCompareLeft = atom<string>({
    key: 'textToCompareLeftState',
    default: '',
})

export const textCompareRight = atom<string>({
    key: 'textToCompareRightState',
    default: '',
})

export const labelCompareLeft = atom<string>({
    key: 'labelToCompareLeftState',
    default: '',
})

export const labelCompareRight = atom<string>({
    key: 'labelToCompareRightState',
    default: '',
})

export const imageCompareLeft = atom<string | ArrayBuffer | null | undefined>({
    key: 'imageToCompareLeftState',
    default: null,
})

export const imageCompareRight = atom<string | ArrayBuffer | null | undefined>({
    key: 'imageToCompareRightState',
    default: null,
})

export const hasPreviewedCompare = atom<boolean>({
    key: 'hasPreviewedCompareState',
    default: false,
})

export const leftPreviewImage = atom<string>({
    key: 'leftPreviewImageState',
    default: '',
})

export const rightPreviewImage = atom<string>({
    key: 'rightPreviewImageState',
    default: '',
})
