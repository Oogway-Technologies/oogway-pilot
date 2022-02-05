import { useState } from "react";
import Head from "next/head";
import { Button } from "@mui/material";
import styled from "styled-components";
import firebase from "firebase/compat/app";
import * as EmailValidator from "email-validator";
import Modal from "../components/Utils/Modal";
import LoginForm from "../components/Login/LoginForm";

function Login() {
  // ========== TODO: redo according to design ========== //

  const [inputEmail, setInputEmail] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [inputPasswordRep, setInputPasswordRep] = useState("");
  const [isOpen, setIsOpen] = useState(false);

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
    <Container>
      <Head>
        <title>Login</title>
      </Head>
      <div>
        <button onClick={openModal}>Login</button>
      </div>
      <LoginContainer>
        <Logo src="https://cdn-icons-png.flaticon.com/512/2395/2395608.png" />
        <SignIn>
          <InputField
            value={inputEmail}
            placeholder="Email"
            onChange={(e) => setInputEmail(e.target.value)}
          />
          <InputField
            type="password"
            value={inputPassword}
            placeholder="Password"
            onChange={(e) => setInputPassword(e.target.value)}
          />
          <InputField
            type="password"
            value={inputPasswordRep}
            placeholder="Repeat Password"
            onChange={(e) => setInputPasswordRep(e.target.value)}
          />
          <CustomSignIn>
            <CustomLoginButton onClick={createAccount} variant="outlined">
              New User
            </CustomLoginButton>
            <CustomLoginButton onClick={LogIn} variant="outlined">
              Log in
            </CustomLoginButton>
          </CustomSignIn>
        </SignIn>
      </LoginContainer>
      <Modal
        children={<LoginForm closeModal={closeModal} />}
        show={isOpen}
        onClose={closeModal}
      />
    </Container>
  );
}

export default Login;

const Container = styled.div`
  display: grid;
  place-items: center;
  height: 100vh;
  background-color: whitesmoke;
`;

const LoginContainer = styled.div`
  padding: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0px 4px 14px -3px rgba(0, 0, 0, 0.75);
`;

const Logo = styled.img`
  height: 200px;
  width: 200px;
  margin-bottom: 50px;
`;

const SignIn = styled.div`
  display: flex;
  flex-direction: column;
  padding: 5px;
  width: 100%;
`;

const InputField = styled.input`
  outline-width: 0;
  padding: 2px;
  margin-bottom: 5px;
  border-bottom: 1px solid lightgray;
`;

const CustomLoginButton = styled(Button)`
  &&& {
    color: black;
    border-top: 1px solid whitesmoke;
    border-bottom: 1px solid whitesmoke;
    outline-width: 0;
    border: 1px solid gray;
    width: 48%;
    margin: 5px;
    font-size: xx-small;
  }
`;

const CustomSignIn = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;
