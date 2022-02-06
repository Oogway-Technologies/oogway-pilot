import { useState } from "react";
import Head from "next/head";
import firebase from "firebase/compat/app";
import Button from "../Utils/Button";
import Modal from "../Utils/Modal";
import PWForm from "./PWForm";
import SignupForm from "./SignupForm";
import { UilEye, UilEyeSlash } from '@iconscout/react-unicons';
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
      <div className={loginDivs.modalHeader}>Login</div>
      <div className={loginDivs.signIn}>
        <div className={loginInputs.inputHeader}>Email</div>
        <div className={loginInputs.inputBorder}>
            <input
                className={loginInputs.inputField}
                value={inputEmail}
                placeholder="Email"
                onChange={(e) => setInputEmail(e.target.value)}
            />
        </div>
        <div className={loginInputs.inputHeader}>Password</div>
        <div className={loginInputs.inputBorder}>
          <input
            className={loginInputs.inputField}
            type={showPassword ? "text" : "password"}
            value={inputPassword}
            placeholder="Password"
            onChange={(e) => setInputPassword(e.target.value)}
          />
              <div
              className={loginInputs.eyeDiv}
                onClick={() => setShowPassword(!showPassword)}
              >
                   {showPassword ? (
                    <UilEyeSlash 
                    className="cursor-pointer" 
                    fill="currentColor"/> 
                   ) : (
                    <UilEye 
                    className="cursor-pointer"
                    fill="currentColor"
                    />
                   )}
              </div>
        </div>
        <div className={loginDivs.customLink} onClick={openRecoveryPW}>
          Forgot your password?
        </div>
        <div className={loginDivs.customSignIn}>
          <Button
            onClick={closeModal}
            addStyle={loginButtons.cancelButtonStyle}
            text="Cancel"
            keepText={true}
            icon={null}
            type="button"
          />
          <Button
            onClick={LogIn}
            addStyle={loginButtons.loginButtonStyle}
            text="Login"
            keepText={true}
            icon={null}
            type="submit"
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
