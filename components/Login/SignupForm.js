import { useState } from "react";
import styled from "styled-components";
import Button from "../Utils/Button";
import firebase from "firebase/compat/app";
import * as EmailValidator from "email-validator";
import ShowPW from "./assets/ShowPW";
import HidePW from "./assets/HidePW";
import { loginButtonStyle, cancelButtonStyle } from "../../styles/login";

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
      <ModalHeader>Sign Up</ModalHeader>
      <div>Create an account below.</div>
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
      <InputHeader>Repeat Password</InputHeader>
      <div className="relative">
        <InputField
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
      <CustomSignIn>
        <Button
          onClick={closeSignupModal}
          addStyle={cancelButtonStyle}
          text="Cancel"
        />
        <Button
          onClick={createAccount}
          addStyle={loginButtonStyle}
          text="Login"
        />
      </CustomSignIn>
      <InputHeader>
        Have an account?&nbsp;
        <CustomLink onClick={(e) => e}>Login</CustomLink>
      </InputHeader>
    </div>
  );
}

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
