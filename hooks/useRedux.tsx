import { TypedUseSelectorHook, useSelector } from 'react-redux'

import store, { AppState } from '../features/store'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = store.dispatch

export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector
