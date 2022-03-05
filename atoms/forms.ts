import { atom } from 'recoil'

export const fileSizeTooLarge = atom<boolean>({
    key: 'fileSizeTooLargeState',
    default: false,
})
