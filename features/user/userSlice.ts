import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { FirebaseProfile } from '../../utils/types/firebase'

const initialState: { user: FirebaseProfile } = {
    user: {
        bio: '',
        dm: false,
        lastName: '',
        location: '',
        name: '',
        profilePic: '',
        resetProfile: true,
        username: '',
        uid: '',
    },
}

export const userSlice = createSlice({
    name: 'userProfile',
    initialState,
    reducers: {
        setUser: (state, { payload }: PayloadAction<FirebaseProfile>) => {
            state.user = payload
        },
    },
})

export const { setUser } = userSlice.actions

export default userSlice.reducer
