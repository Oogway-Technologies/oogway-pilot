import { useState } from "react";
import Head from "next/head";
import styled from "styled-components";
import firebase from "firebase/compat/app";
import * as EmailValidator from "email-validator";
import Button from "../../components/Utils/Button";

export default function LoginForm() {
  const [inputEmail, setInputEmail] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [inputPasswordRep, setInputPasswordRep] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [recoverPW, setRecoverPW] = useState(false);

  // Modal helper functions
  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

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
        <InputHeader>email</InputHeader>
        <InputField
          value={inputEmail}
          placeholder="Email"
          onChange={(e) => setInputEmail(e.target.value)}
        />
        <InputHeader>Password</InputHeader>
        <InputField
          type="password"
          value={inputPassword}
          placeholder="Password"
          onChange={(e) => setInputPassword(e.target.value)}
        />
        <CustomLink onClick={e => {e}}>Forgot your password?</CustomLink>
        <CustomSignIn>
          <Button onClick={LogIn} addStyle={cancelButtonStyle} text="Cancel"/>
          <Button onClick={LogIn} addStyle={loginButtonStyle} text="Login"/>
        </CustomSignIn>
      </SignIn>
      <InputHeader>Don't have an account?&nbsp;<CustomLink onClick={e => {e}}>Sign up</CustomLink></InputHeader>
    </div>
  );
}

const loginButtonStyle = "rounded-[20px] p-sm md:px-md md:space-x-2 border-solid border-transparent\
text-neutral-700 dark:text-neutralDark-150 \
bg-violet-600 text-white \
hover:font-bold active:font-bold dark:hover:font-bold dark:active:font-bold hover:text-black \
hover:bg-neutral-50 dark:hover:bg-neutralDark-300 active:bg-primary/20 dark:active:bg-primaryDark/20\
hover:text-neutral-700 dark:hover:text-neutralDark-150 active:text-primary dark:active:text-primaryDark"

const cancelButtonStyle = "rounded-[20px] p-sm md:px-md md:space-x-2 border-solid border-transparent\
text-neutral-700 dark:text-neutralDark-150 \
bg-stone-300 text-slate-700 pr-3.5 \
hover:font-bold active:font-bold dark:hover:font-bold dark:active:font-bold hover:text-black \
hover:bg-neutral-50 dark:hover:bg-neutralDark-300 active:bg-primary/20 dark:active:bg-primaryDark/20\
hover:text-neutral-700 dark:hover:text-neutralDark-150 active:text-primary dark:active:text-primaryDark"


const SignIn = styled.div`
  display: flex;
  flex-direction: column;
  padding: 5px;
  width: 100%;
`;

const InputHeader = styled.div`
  outline-width: 0;
  padding: 2px;
  margin-bottom: 5px;
  font-size: 12px;
  color: rgb(83,83,83);
  margin-right: auto;
  display: flex;
`;

const InputField = styled.input`
  outline-width: 0;
  padding: 2px;
  margin-bottom: 5px;
  border: 1px solid lightgray;
  border-radius: 5px;
`;


const CustomSignIn = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 50px;
`;  

const ModalHeader = styled.div`
  font-size: 20px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const CustomLink = styled.div`
font-size: 12px;
color: rgb(112, 65, 238);
cursor: pointer;
float: right;
`;