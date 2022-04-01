import { atom } from 'recoil'

export const notificationsState = atom<boolean>({
    key: 'notificationsState',
    default: false,
})
