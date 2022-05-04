import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit'

import decisionSlice from './decision/decisionSlice'
import userSlice from './user/userSlice'
import utilsSlice from './utils/utilsSlice'

const store = configureStore({
    reducer: { userSlice, utilsSlice, decisionSlice },
})

export type AppState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    AppState,
    unknown,
    Action<string>
>

export default store
