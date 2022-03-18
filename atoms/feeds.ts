import { atom } from 'recoil'

export const feedState = atom<string>({
    key: 'feedState',
    default: 'All',
})
