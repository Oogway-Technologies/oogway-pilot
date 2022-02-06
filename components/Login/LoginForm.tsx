import { useState } from "react";
import Head from "next/head";
import styled from "styled-components";
import firebase from "firebase/compat/app";
import Button from "../Utils/Button";
import Modal from "../Utils/Modal";
import PWForm from "./PWForm";
import SignupForm from "./SignupForm";
import ShowPW from "./assets/ShowPW";
import HidePW from "./assets/HidePW";
import { loginButtons, loginDivs, loginInputs } from "../../styles/login";

export default function LoginForm({ closeModal }) {
  const [inputEmail, setInputEmail] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [recoverPW, setRecoverPW] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Modal helper functions
  const openModal = () => {
    setIsOpen(true);
  };

  const openRecoveryPW = () => {
    setRecoverPW(true);
  };

  const closeRecoveryPW = () => {
    setRecoverPW(false);
  };

  const openSignupModal = () => {
    setShowSignup(true);
  };

  const closeSignupModal = () => {
    setShowSignup(false);
  };

  const LogIn = () => {
    if (inputEmail && inputPassword) {
      firebase
        .auth()
        .signInWithEmailAndPassword(inputEmail, inputPassword)
        .then((userCredential) => {
          // Signed in: not much to do here
          // redirection happend on shate change from the _app
          const user = userCredential.user;
        })
        .catch((error) => {
          alert("Invalid Email and Password");
        });
    } else {
      alert("Empty fields!");
    }
  };

  return (
    <div>
      <Head>
        <title>Login</title>
      </Head>
      <div>
        <button type="button" onClick={openModal}>
          <div className={loginDivs.modalHeader}>Login</div>
        </button>
      </div>
      <div className={loginDivs.signIn}>
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
        <div className={loginDivs.customLink} onClick={openRecoveryPW}>
          Forgot your password?
        </div>
        <div className={loginDivs.customSignIn}>
          <Button
            onClick={closeModal}
            addStyle={loginButtons.cancelButtonStyle}
            text="Cancel"
          />
          <Button
            onClick={LogIn}
            addStyle={loginButtons.loginButtonStyle}
            text="Login"
          />
        </div>
      </div>
      <div className={loginInputs.inputHeader}>
        Don't have an account?&nbsp;
        <div className={loginDivs.customLink} onClick={openSignupModal}>
          Sign up
        </div>
      </div>
      <Modal
        children={<PWForm closeModal={closeRecoveryPW} />}
        show={recoverPW}
        onClose={closeRecoveryPW}
      />
      <Modal
        children={<SignupForm closeSignupModal={closeSignupModal} />}
        show={showSignup}
        onClose={closeSignupModal}
      />
    </div>
  );
}
