import { atom } from 'recoil'
import { FirebaseProfile } from '../utils/types/firebase'

export const defaultProfile = {
    bio: '',
    dm: false,
    lastName: '',
    location: '',
    name: '',
    profilePic: '',
    resetProfile: true,
    username: '',
    uid: '',
}

// userProfileState is an Atom, a global state
// that can be accessed by any component
export const userProfileState = atom<FirebaseProfile>({
    key: 'userProfileState', // unique ID of the global state atom
    default: defaultProfile, // default value to avoid warnings?
})
