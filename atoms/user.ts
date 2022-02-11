import {atom} from "recoil";
import {FirebaseUserProfile} from "../utils/types/firebase";

// userProfileState is an Atom, a global state
// that can be accessed by any component
export const userProfileState = atom<FirebaseUserProfile | {}>({
    key: "userProfileState", // unique ID of the global state atom
    default: {}, // default value is empty
});
