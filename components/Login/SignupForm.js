import { useState } from "react";
import styled from "styled-components";
import Button from "../Utils/Button";
import firebase from "firebase/compat/app";
import * as EmailValidator from "email-validator";
import ShowPW from "./assets/ShowPW";
import HidePW from "./assets/HidePW";
import { loginButtons, loginDivs, loginInputs } from "../../styles/login";

export default function SignUpForm({ closeSignupModal }) {
  const [inputEmail, setInputEmail] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [inputPasswordRep, setInputPasswordRep] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const createAccount = () => {
    if (inputEmail && inputPassword && inputPasswordRep) {
      if (inputPassword === inputPasswordRep) {
        if (EmailValidator.validate(inputEmail)) {
          firebase
            .auth()
            .createUserWithEmailAndPassword(inputEmail, inputPassword)
            .then((userCredential) => {
              // Signed in: not much to do here,
              // redirection happend on state change from the _app
              const user = userCredential.user;
            })
            .catch((error) => {
              console.log(error);
              alert(error.message);
            });
        } else {
          alert("Invalid email");
        }
      } else {
        alert("Password don't match!");
      }
    } else {
      alert("Some of the fields are missing!");
    }
  };

  return (
    <div>
      <div className={loginDivs.modalHeader}>Sign Up</div>
      <div>Create an account below.</div>
      <div className={loginInputs.inputHeader}>Email</div>
      <input
        className={loginInputs.inputField}
        value={inputEmail}
        placeholder="Email"
        onChange={(e) => setInputEmail(e.target.value)}
      />
      <div className={loginInputs.inputHeader}>Password</div>
      <div className="relative">
        <input
          className={loginInputs.inputField}
          type={showPassword ? "text" : "password"}
          value={inputPassword}
          placeholder="Password"
          onChange={(e) => setInputPassword(e.target.value)}
        />
        <label
          onClick={() => setShowPassword(!showPassword)}
          className="showPW"
        >
          {showPassword ? (
            <div className="w-7">
              <HidePW fill="currentColor" />
            </div>
          ) : (
            <div className="w-7">
              <ShowPW fill="currentColor" />
            </div>
          )}
        </label>
      </div>
      <div className={loginInputs.inputHeader}>Repeat Password</div>
      <div className="relative">
        <input
          className={loginInputs.inputField}
          type={showPassword ? "text" : "password"}
          value={inputPasswordRep}
          placeholder="Repeat Password"
          onChange={(e) => setInputPasswordRep(e.target.value)}
        />
        <label
          onClick={() => setShowPassword(!showPassword)}
          className="showPW"
        >
          {showPassword ? (
            <div className="w-7">
              <HidePW fill="currentColor" />
            </div>
          ) : (
            <div className="w-7">
              <ShowPW fill="currentColor" />
            </div>
          )}
        </label>
      </div>
      <div className={loginDivs.customSignIn}>
        <Button
          onClick={closeSignupModal}
          addStyle={loginButtons.cancelButtonStyle}
          text="Cancel"
        />
        <Button
          onClick={createAccount}
          addStyle={loginButtons.loginButtonStyle}
          text="Login"
        />
      </div>
      <div className={loginInputs.inputHeader}>
        Have an account?&nbsp;
        <div className={loginDivs.customLink} onClick={(e) => e}>
          Login
        </div>
      </div>
    </div>
  );
}
