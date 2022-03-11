// @ts-ignore
import {
    UilExclamationTriangle,
    UilEye,
    UilEyeSlash,
    //@ts-ignore
} from '@iconscout/react-unicons'

import { FC, MouseEvent, useEffect, useMemo, useRef, useState } from 'react'
// JSX and Styles
import Button from '../Utils/Button'
import { loginButtons, loginDivs, loginInputs } from '../../styles/login'

// Form
import * as EmailValidator from 'email-validator'
import { useForm } from 'react-hook-form'

// db
import firebase from 'firebase/compat/app'
import { useRouter } from 'next/router'
import { createUserProfile } from '../../lib/db'
import { getRandomProfilePic, getRandomUsername } from '../../lib/user'
import FlashErrorMessage from '../Utils/FlashErrorMessage'
import Modal from '../Utils/Modal'
import PrivacyPolicy from './PrivacyPolicy'
import TermsConditions from './TermsConditions'
import preventDefaultOnEnter from '../../utils/helpers/preventDefaultOnEnter'

type SignUpFormProps = {
    goToLogin: () => void
    goToProfile: () => void
    closeModal: () => void
}

const SignUpForm: FC<SignUpFormProps> = ({
    goToLogin,
    goToProfile,
    closeModal,
}) => {
    // Router
    const router = useRouter()

    // Form management
    const inputEmailRef = useRef<HTMLInputElement>(null)
    const inputPasswordRef = useRef<HTMLInputElement>(null)
    const inputPasswordRepRef = useRef<HTMLInputElement>(null)
    const [showPassword, setShowPassword] = useState(false)
    const [showPasswordRep, setShowPasswordRep] = useState(false)
    const [isPrivacyModal, setIsPrivacyModal] = useState(false)
    const [isTerm, setIsTerm] = useState(false)

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
    useEffect(() => {
        register('password', { required: true })
    }, [])
    useEffect(() => {
        register('passwordRep', { required: true })
    }, [])
    useEffect(() => {
        register('match', { required: true })
    }, [])

    // Database hook to create account
    const createAccount = () => {
        if (!inputEmailRef?.current?.value) {
            setError(
                'email',
                { type: 'required', message: 'Missing email.' },
                { shouldFocus: true }
            )
            return false
        }

        if (!inputPasswordRef?.current?.value) {
            setError(
                'password',
                { type: 'required', message: 'Missing password.' },
                { shouldFocus: true }
            )
            return false
        }

        if (!inputPasswordRepRef?.current?.value) {
            setError(
                'passwordRep',
                { type: 'required', message: 'Missing password.' },
                { shouldFocus: true }
            )
            return false
        }

        if (
            inputEmailRef.current.value &&
            inputPasswordRef.current.value &&
            inputPasswordRepRef.current.value
        ) {
            if (
                inputPasswordRef.current.value !==
                inputPasswordRepRef.current.value
            ) {
                setError(
                    'match',
                    { type: 'required', message: 'Passwords do not match' },
                    { shouldFocus: true }
                )
                return false
            } else {
                if (!EmailValidator.validate(inputEmailRef.current.value)) {
                    setError(
                        'email',
                        { type: 'required', message: 'Email is invalid.' },
                        { shouldFocus: true }
                    )
                    return false
                } else {
                    firebase
                        .auth()
                        .createUserWithEmailAndPassword(
                            inputEmailRef.current.value,
                            inputPasswordRef.current.value
                        )
                        .then(userCredential => {
                            // Signed in: not much to do here,
                            // redirection happend on state change from the _app
                            const user = userCredential.user

                            // Create user profile
                            createUserProfile(user?.uid, {
                                username: getRandomUsername(),
                                name: '',
                                lastName: '',
                                profilePic: getRandomProfilePic(),
                                bio: '',
                                location: '',
                                dm: false,
                                resetProfile: true,
                            })
                        })
                        .catch(error => {
                            console.log(error)
                        })
                }
            }
        }

        return true
    }

    const createAndGoToProfile = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        const success = createAccount()
        if (success) {
            // goToProfile()
            router.push('/')
        }
    }

    const PrivacyModal = useMemo(
        () => (
            <Modal show={isPrivacyModal} onClose={setIsPrivacyModal}>
                <PrivacyPolicy />
            </Modal>
        ),
        [isPrivacyModal]
    )

    const TermModal = useMemo(
        () => (
            <Modal show={isTerm} onClose={setIsTerm}>
                <TermsConditions />
            </Modal>
        ),
        [isTerm]
    )

    return (
        <div>
            <div className={loginDivs.modalHeader}>Sign Up</div>
            <div>Create an account below.</div>

            <div className={loginInputs.inputHeader}>Email</div>
            <div className={loginDivs.signIn}>
                <div className={loginInputs.inputBorder}>
                    <input
                        className={loginInputs.inputField}
                        type="text"
                        ref={inputEmailRef}
                        placeholder="Email"
                        onKeyPress={preventDefaultOnEnter}
                    />
                </div>
                {/* Warning message on email */}
                {errors.email && errors.email.type === 'required' && (
                    <FlashErrorMessage
                        message={errors.email.message}
                        ms={warningTime}
                        style={loginInputs.formAlert}
                    />
                )}
            </div>

            <div className={loginInputs.inputHeader}>Password</div>
            <div className={loginDivs.signIn}>
                <div className={loginInputs.inputBorder}>
                    <input
                        className={loginInputs.inputField}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        ref={inputPasswordRef}
                        onKeyPress={preventDefaultOnEnter}
                    />
                    <div
                        className={loginDivs.eye}
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? (
                            <UilEyeSlash
                                className="cursor-pointer"
                                fill="currentColor"
                            />
                        ) : (
                            <UilEye
                                className="cursor-pointer"
                                fill="currentColor"
                            />
                        )}
                    </div>
                </div>

                {/* Warning message on password */}
                {errors.password && errors.password.type === 'required' && (
                    <FlashErrorMessage
                        message={errors.password.message}
                        ms={warningTime}
                        style={loginInputs.formAlert}
                    />
                )}
            </div>

            <div className={loginInputs.inputHeader}>Repeat Password</div>
            <div className={loginDivs.signIn}>
                <div className={loginInputs.inputBorder}>
                    <input
                        className={loginInputs.inputField}
                        type={showPasswordRep ? 'text' : 'password'}
                        placeholder="Repeat Password"
                        ref={inputPasswordRepRef}
                        onKeyPress={preventDefaultOnEnter}
                    />
                    <div
                        className={loginDivs.eye}
                        onClick={() => setShowPasswordRep(!showPasswordRep)}
                    >
                        {showPasswordRep ? (
                            <UilEyeSlash
                                className="cursor-pointer"
                                fill="currentColor"
                            />
                        ) : (
                            <UilEye
                                className="cursor-pointer"
                                fill="currentColor"
                            />
                        )}
                    </div>
                </div>
                {/* Warning message on password repeat */}
                {errors.passwordRep &&
                    errors.passwordRep.type === 'required' && (
                        <FlashErrorMessage
                            message={errors.passwordRep.message}
                            ms={warningTime}
                            style={loginInputs.formAlert}
                        />
                    )}
                {/* Warning message on password repeat */}
                {errors.match && errors.match.type === 'required' && (
                    <FlashErrorMessage
                        message={errors.match.message}
                        ms={warningTime}
                        style={loginInputs.formAlert}
                    />
                )}
            </div>
            <div className={loginDivs.checkbox}>
                <input type="checkbox" className={loginButtons.checkbox} />
                <b>
                    I have read and accept Oogway’s{' '}
                    <span
                        className={'text-primary cursor-pointer mx-1'}
                        onClick={() => setIsTerm(!isTerm)}
                    >
                        Terms of Use
                    </span>{' '}
                    and{' '}
                    <span
                        className={'text-primary cursor-pointer mx-1'}
                        onClick={() => setIsPrivacyModal(!isPrivacyModal)}
                    >
                        Privacy Policy
                    </span>
                </b>
                {PrivacyModal}
                {TermModal}
            </div>
            <div className={loginDivs.customSignUp}>
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
                    onClick={createAndGoToProfile}
                    addStyle={loginButtons.loginButtonStyle}
                    text="Login"
                    keepText={true}
                    forceNoText={false}
                    icon={null}
                    type="submit"
                />
            </div>

            <div className={loginInputs.inputHeader}>
                Have an account?&nbsp;
                <div className={loginDivs.customLink} onClick={goToLogin}>
                    Login
                </div>
            </div>
        </div>
    )
}

export default SignUpForm
