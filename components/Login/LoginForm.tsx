import { useState } from "react";
import Head from "next/head";
import styled from "styled-components";
import firebase from "firebase/compat/app";
import * as EmailValidator from "email-validator";
import Button from "../Utils/Button";
import Modal from "../Utils/Modal";
import PWForm from "./PWForm";
import SignupForm from "./SignupForm";
import ShowPW from "./ShowPW";
import HidePW from "./HidePW";

export default function LoginForm({ closeModal }) {
  const [inputEmail, setInputEmail] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [inputPasswordRep, setInputPasswordRep] = useState("");
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
          <ModalHeader>Login</ModalHeader>
        </button>
      </div>
      <SignIn>
        <InputHeader>Email</InputHeader>
        <InputField
          value={inputEmail}
          placeholder="Email"
          onChange={(e) => setInputEmail(e.target.value)}
        />
        <InputHeader>Password</InputHeader>
        <div className="relative">
          <InputField
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
        <CustomLink onClick={openRecoveryPW}>Forgot your password?</CustomLink>
        <CustomSignIn>
          <Button
            onClick={closeModal}
            addStyle={cancelButtonStyle}
            text="Cancel"
          />
          <Button onClick={LogIn} addStyle={loginButtonStyle} text="Login" />
        </CustomSignIn>
      </SignIn>
      <InputHeader>
        Don't have an account?&nbsp;
        <CustomLink onClick={openSignupModal}>Sign up</CustomLink>
      </InputHeader>
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

const loginButtonStyle =
  "rounded-[20px] p-sm my-5  w-2/4 mx-2 justify-center px-1.5 py-3 md:px-md md:space-x-2 border-solid border-transparent\
text-neutral-700 dark:text-neutralDark-150 \
bg-violet-600 text-white \
hover:font-bold active:font-bold dark:hover:font-bold dark:active:font-bold hover:text-black \
hover:bg-neutral-50 dark:hover:bg-neutralDark-300 active:bg-primary/20 dark:active:bg-primaryDark/20\
hover:text-neutral-700 dark:hover:text-neutralDark-150 active:text-primary dark:active:text-primaryDark";

const cancelButtonStyle =
  "rounded-[20px] w-2/4 mx-2 px-1.5 py-3 justify-center align-middle content-center p-sm md:px-md md:space-x-2 border-solid border-transparent\
text-neutral-700 dark:text-neutralDark-150 \
bg-stone-300 text-slate-700 pr-3.5 \
hover:font-bold active:font-bold dark:hover:font-bold dark:active:font-bold hover:text-black \
hover:bg-neutral-50 dark:hover:bg-neutralDark-300 active:bg-primary/20 dark:active:bg-primaryDark/20\
hover:text-neutral-700 dark:hover:text-neutralDark-150 active:text-primary dark:active:text-primaryDark";

const SignIn = styled.div`
  display: flex;
  flex-direction: column;
  padding: 5px;
  width: 100%;
`;

const InputHeader = styled.div`
  outline-width: 0;
  padding: 2px;
  margin-top: 10px;
  margin-bottom: 5px;
  font-size: 16px;
  color: rgb(83, 83, 83);
  margin-right: auto;
  display: flex;
`;

const InputField = styled.input`
  outline-width: 0;
  padding: 2px;
  margin-bottom: 5px;
  border: 1px solid lightgray;
  border-radius: 5px;
  width: 550px;
  height: 40px;
`;

const CustomSignIn = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 50px;
`;

const ModalHeader = styled.div`
  padding-top: 10px;
  padding-bottom: 10px;
  font-size: 24px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const CustomLink = styled.div`
  font-size: 16px;
  color: rgb(112, 65, 238);
  cursor: pointer;
  float: right;
`;
