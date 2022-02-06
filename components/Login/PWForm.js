import { useState } from "react";
import styled from "styled-components";
import Button from "../Utils/Button";
import Modal from "../Utils/Modal";
import * as EmailValidator from "email-validator";
import { loginButtons, loginDivs, loginInputs } from "../../styles/login";
import useTimeout from "../../hooks/useTimeout";

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
        .then(() => {
          useTimeout(() => {
            closeEmailSent();
            closeModal();
            setShowEmailSent(false);
          }, 500);
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
        <div className={loginDivs.modalHeader}>Forgot Password</div>
        <div>
          We've sent an email with instructions on how to reset your password to
          your inbox.
        </div>
        <div className={loginDivs.recoveryNotification}>
          <div className={loginDivs.recoveryText}>Sent to: {recoverEmail}</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className={loginDivs.modalHeader}>Forgot Password</div>
      <div className={loginDivs.textDisplay}>
        We'll send you a link to set a new password. Please enter the Email you
        signed up with.
      </div>
      <div className={loginInputs.inputHeader}>Email</div>
      <input
        className={loginInputs.inputField}
        value={recoverEmail}
        placeholder="Email"
        onChange={(e) => setRecoverEmail(e.target.value)}
      />
      <div className={loginDivs.customSignIn}>
        <Button
          onClick={closeModal}
          addStyle={loginButtons.cancelButtonStyle}
          text="Cancel"
        />
        <Button
          onClick={sendReset}
          addStyle={loginButtons.loginButtonStyle}
          text="Send Link"
        />
      </div>
      <Modal
        children={<ForgotPW closeModal={closeRecoveryModal} />}
        show={showEmailSent}
        onClose={closeEmailSent}
      />
    </div>
  );
}
