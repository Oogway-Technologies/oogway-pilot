import { atom } from "recoil";

// userProfileState is an Atom, a global state
// that can be accessed by any component
export const userProfileState = atom({
  key: "userProfileState", // unique ID of the global state atom
  default: {}, // default value is empty
});
