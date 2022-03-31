import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit'

import userSlice from './user/userSlice'
import utilsSlice from './utils/utilsSlice'

const store = configureStore({
    reducer: { userSlice, utilsSlice },
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
