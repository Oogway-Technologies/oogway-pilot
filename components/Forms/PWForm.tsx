// Form
import * as EmailValidator from 'email-validator'
// db
import firebase from 'firebase/compat/app'
import { FC, MouseEvent, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'

import { loginButtons, loginDivs, loginInputs } from '../../styles/login'
import preventDefaultOnEnter from '../../utils/helpers/preventDefaultOnEnter'
// JSX and styling
import Button from '../Utils/Button'
import FlashErrorMessage from '../Utils/FlashErrorMessage'

type PWFormProps = {
    goToLogin: () => void
    closeModal: () => void
}

const PWForm: FC<PWFormProps> = ({ goToLogin, closeModal }) => {
    const recoveryEmailRef = useRef<HTMLInputElement>(null)
    const [showEmailSent, setShowEmailSent] = useState(false)

    // Form management
    const {
        register,
        setError,
        formState: { errors },
    } = useForm()
    const warningTime = 3000 // set warning to flash for 3 sec

    // Register the form inputs w/o hooks so as not to interfere w/ existing hooks
    useEffect(() => {
        register('email', { required: true })
    }, [])

    const sendReset = () => {
        if (!recoveryEmailRef?.current?.value) {
            setError(
                'email',
                { type: 'required', message: 'Missing email.' },
                { shouldFocus: true }
            )
            return false //
        }
        if (!EmailValidator.validate(recoveryEmailRef.current.value)) {
            setError(
                'email',
                {
                    type: 'required',
                    message: 'Invalid email address. Please retry.',
                },
                { shouldFocus: true }
            )
            return false
        } else {
            firebase
                .auth()
                .sendPasswordResetEmail(recoveryEmailRef.current.value)
                .then(() => {
                    setShowEmailSent(true)
                })
        }

        return true
    }

    const sendAndClose = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        const success = sendReset()
        if (success) {
            // Toggle email sent letter
            setShowEmailSent(!showEmailSent)
        }
    }

    const ForgotPWMessage = () => {
        // Otherwise return message
        return (
            <div>
                <div className={loginDivs.modalHeader}>Forgot Password</div>
                <div>
                    {`We've sent an email with instructions on how to reset your
                    password to your inbox.`}
                </div>
                <div className={loginDivs.recoveryNotification}>
                    <div className={loginDivs.recoveryText}>
                        Sent to:{' '}
                        {recoveryEmailRef?.current?.value
                            ? recoveryEmailRef?.current?.value
                            : ''}
                    </div>
                </div>
                <div className={loginDivs.customSignIn}>
                    <Button
                        onClick={goToLogin}
                        addStyle={loginButtons.closeButtonStyle}
                        text="Close"
                        keepText={true}
                        forceNoText={false}
                        icon={null}
                        type="button"
                    />
                </div>
            </div>
        )
    }

    const ForgotPWForm = () => {
        return (
            <div>
                <div className={loginDivs.modalHeader}>Forgot Password</div>
                <div className={loginDivs.textDisplay}>
                    {`We'll send you a link to set a new password. Please enter
                    the Email you signed up with.`}
                </div>
                <div className={loginDivs.signIn}>
                    <div className={loginInputs.inputHeader}>Email</div>
                    <div className={loginInputs.inputBorder}>
                        <input
                            className={loginInputs.inputField}
                            ref={recoveryEmailRef}
                            type="text"
                            placeholder="Email"
                            onKeyPress={preventDefaultOnEnter}
                        />
                    </div>
                    {/* Warning message on password */}
                    {errors.email && errors.email.type === 'required' && (
                        <FlashErrorMessage
                            message={errors.email.message}
                            ms={warningTime}
                            style={loginInputs.formAlert}
                        />
                    )}
                </div>
                <div className={loginDivs.customSignIn}>
                    <Button
                        onClick={closeModal}
                        addStyle={loginButtons.cancelButtonStyle}
                        text="Cancel"
                        keepText={true}
                        forceNoText={false}
                        icon={null}
                        type="button"
                    />
                    <Button
                        onClick={e => sendAndClose(e)}
                        addStyle={loginButtons.loginButtonStyle}
                        text="Send Link"
                        keepText={true}
                        forceNoText={false}
                        icon={null}
                        type="submit"
                    />
                </div>
            </div>
        )
    }

    return <>{showEmailSent ? <ForgotPWMessage /> : <ForgotPWForm />}</>
}

export default PWForm
