import { useState } from "react";
import styled from "styled-components";
import Button from "../../components/Utils/Button";
import Modal from "../Utils/Modal";
import * as EmailValidator from "email-validator";

import firebase from "firebase/compat/app";

export default function PWForm({ closeModal }) {
  const [recoverEmail, setRecoverEmail] = useState("");
  const [openReset, setOpenReset] = useState(false);
  const [showEmailSent, setShowEmailSent] = useState(false);

  const sendReset = () => {
    if (EmailValidator.validate(recoverEmail)) {
      firebase
        .auth()
        .sendPasswordResetEmail(recoverEmail)
        .then(() => {
          setShowEmailSent(true);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
        });
    }
  };

  // Modal helper functions
  const openRecoveryModal = () => {
    setOpenReset(true);
  };

  const closeRecoveryModal = () => {
    setOpenReset(false);
  };

  const closeEmailSent = () => {
    setShowEmailSent(false);
  };

  function ForgotPW() {
    return (
      <div>
        <ModalHeader>Forgot Password</ModalHeader>
        <div>
          We've sent an email with instructions on how to reset your password to
          your inbox.
        </div>
        <RecoveryNotification>
          <RecoveryText>Sent to: {recoverEmail}</RecoveryText>
        </RecoveryNotification>
        <InputHeader>
          Haven't received a link?&nbsp;
          <CustomLink onClick={sendReset}>Resend</CustomLink>
        </InputHeader>
      </div>
    );
  }

  return (
    <div>
      <ModalHeader>Forgot Password</ModalHeader>
      <TextDisplay>
        We'll send you a link to set a new password. Please enter the Email you
        signed up with.
      </TextDisplay>
      <InputHeader>email</InputHeader>
      <InputField
        value={recoverEmail}
        placeholder="Email"
        onChange={(e) => setRecoverEmail(e.target.value)}
      />
      <CustomSignIn>
        <Button
          onClick={closeModal}
          addStyle={cancelButtonStyle}
          text="Cancel"
        />
        <Button
          onClick={sendReset}
          addStyle={loginButtonStyle}
          text="Send Link"
        />
      </CustomSignIn>
      <InputHeader>
        Haven't received a link?&nbsp;
        <CustomLink onClick={sendReset}>Resend</CustomLink>
      </InputHeader>
      <Modal
        children={<ForgotPW closeModal={closeRecoveryModal} />}
        show={showEmailSent}
        onClose={closeEmailSent}
      />
    </div>
  );
}

const ModalHeader = styled.div`
  padding-top: 10px;
  padding-bottom: 10px;
  font-size: 24px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: flex-start;
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

const TextDisplay = styled.div`
  max-width: 550px;
`;

const RecoveryNotification = styled.div`
  outline-width: 0;
  margin-top: 10px;
  padding: 2px;
  margin-bottom: 5px;
  background-color: #f4f4f4;
  margin-right: auto;
  display: flex;
`;

const RecoveryText = styled.div`
  padding: 2px;
  font-size: 16px;
  color: #535353;
  margin: 5px;
`;

const InputField = styled.input`
  outline-width: 0;
  padding: 2px;
  margin-bottom: 5px;
  border: 1px solid lightgray;
  border-radius: 5px;
  width: 100%;
`;

const CustomSignIn = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 50px;
`;

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

const CustomLink = styled.div`
  font-size: 16px;
  color: rgb(112, 65, 238);
  cursor: pointer;
  float: right;
`;
