import {atom} from "recoil";

// termsAndConditionsPopUpState is an Atom, a global state
// that can be accessed by any component
export const termsAndConditionsPopUpState = atom<boolean>({
    key: "termsAndConditionsPopUpState", // unique ID of the global state atom
    default: false, // default value
});
