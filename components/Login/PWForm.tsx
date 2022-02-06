import { useState, useRef, useEffect } from "react";

// JSX and styling
import Button from "../Utils/Button";
import Modal from "../Utils/Modal";
import { loginButtons, loginDivs, loginInputs } from "../../styles/login";
import { UilExclamationTriangle } from "@iconscout/react-unicons";

// Form
import * as EmailValidator from "email-validator";
import { useForm } from "react-hook-form";
import { FlashErrorMessageProps } from "../Utils/FlashErrorMessage";
import useTimeout from "../../hooks/useTimeout";

// db
import firebase from "firebase/compat/app";

const PWForm = ({ closeModal }) => {
  const recoveryEmailRef = useRef(null);
  const [showEmailSent, setShowEmailSent] = useState(false);

  // Form management
  const {
    register,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();
  const warningTime = 3000; // set warning to flash for 3 sec

  // Register the form inputs w/o hooks so as not to interfere w/ existing hooks
  useEffect(() => {
    register("email", { required: true });
  }, []);

  const FlashErrorMessage: React.FC<FlashErrorMessageProps> = ({
    message,
    ms,
    style,
    error,
  }) => {
    // Tracks how long a form warning message has been displayed
    const [warningHasElapsed, setWarningHasElapsed] = useState(false);

    useTimeout(() => {
      setWarningHasElapsed(true);
    }, ms);

    // If show is false the component will return null and stop here
    if (warningHasElapsed) {
      if (error) {
        clearErrors(error);
      }
      return null;
    }

    // Otherwise, return warning
    return (
      <span className={style} role='alert'>
        <UilExclamationTriangle className='mr-1 h-4' /> {message}
      </span>
    );
  };

  const sendReset = () => {
    if (!recoveryEmailRef.current.value) {
        setError(
            "email",
            { type: "required", message: "Missing email." },
            { shouldFocus: true }
        )
        return false //
    }
    if (!EmailValidator.validate(recoveryEmailRef.current.value)) {
        setError(
            "email",
            { type: "required", message: "Invalid email address. Please retry." },
            { shouldFocus: true }
        )
        return false
    } else {
      firebase
        .auth()
        .sendPasswordResetEmail(recoveryEmailRef.current.value)
        .then(() => {
          setShowEmailSent(true);
        })
        .catch((e) => {
          const errorCode = e.code;
          const errorMessage = e.message;
        });
    }

    return true
  };

  const sendAndClose = (e) => {
      e.preventDefault();
      const success = sendReset();
      if (success) {
          // Toggle email sent letter
          setShowEmailSent(!showEmailSent);
      } 
  }


  const ForgotPWMessage = () => {
    // Otherwise return message
    return (
      <div>
        <div className={loginDivs.modalHeader}>Forgot Password</div>
        <div>
          We've sent an email with instructions on how to reset your password to
          your inbox.
        </div>
        <div className={loginDivs.recoveryNotification}>
          <div className={loginDivs.recoveryText}>Sent to: {
            recoveryEmailRef?.current?.value ? recoveryEmailRef?.current?.value : ""
          }
          </div>
        </div>
        <div className={loginDivs.customSignIn}>
            <Button
            onClick={closeModal}
            addStyle={loginButtons.closeButtonStyle}
            text='Close'
            keepText={true}
            icon={null}
            type='button'
            />
        </div>
      </div>
    );
  }

  const ForgotPWForm = () => {
    return (
        <div>
            <div className={loginDivs.modalHeader}>Forgot Password</div>
            <div className={loginDivs.textDisplay}>
                We'll send you a link to set a new password. Please enter the Email you
                signed up with.
            </div>
            <div className={loginDivs.signIn}>
                <div className={loginInputs.inputHeader}>Email</div>
                <div className={loginInputs.inputBorder}>
                    <input
                    className={loginInputs.inputField}
                    ref={recoveryEmailRef}
                    type="text"
                    placeholder='Email'
                    />
                </div>
                {/* Warning message on password */}
                {errors.email && errors.email.type === 'required' && (
                    <FlashErrorMessage 
                        message={errors.email.message}
                        ms={warningTime}
                        style={loginInputs.formAlert}
                        error="email"
                    />
                )}
            </div>
            <div className={loginDivs.customSignIn}>
                <Button
                onClick={closeModal}
                addStyle={loginButtons.cancelButtonStyle}
                text='Cancel'
                keepText={true}
                icon={null}
                type='button'
                />
                <Button
                onClick={(e) => sendAndClose(e)}
                addStyle={loginButtons.loginButtonStyle}
                text='Send Link'
                keepText={true}
                icon={null}
                type='submit'
                />
            </div>
        </div>
      );
  }

  return (
    <>
    {showEmailSent ? <ForgotPWMessage/> : <ForgotPWForm/>}
    </>
  );
}

export default PWForm;