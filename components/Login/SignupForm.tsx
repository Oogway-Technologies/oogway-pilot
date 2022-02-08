import { FC, useEffect, useRef, useState } from 'react'

// JSX and Styles
import Button from '../Utils/Button'
import {
    UilEye,
    UilEyeSlash,
    UilExclamationTriangle,
} from '@iconscout/react-unicons'
import { loginButtons, loginDivs, loginInputs } from '../../styles/login'

// Form
import * as EmailValidator from 'email-validator'
import { useForm } from 'react-hook-form'
import { FlashErrorMessageProps } from '../Utils/FlashErrorMessage'
import useTimeout from '../../hooks/useTimeout'

// db
import firebase from 'firebase/compat/app'
import { useRouter } from 'next/router'
import { createUserProfile } from '../../lib/db'
import { getRandomProfilePic, getRandomUsername } from '../../lib/user'

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
    const inputEmailRef = useRef(null)
    const inputPasswordRef = useRef(null)
    const inputPasswordRepRef = useRef(null)
    const [showPassword, setShowPassword] = useState(false)
    const [showPasswordRep, setShowPasswordRep] = useState(false)
    const {
        register,
        setError,
        clearErrors,
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

    const FlashErrorMessage: FC<FlashErrorMessageProps> = ({
        message,
        ms,
        style,
        error,
    }) => {
        // Tracks how long a form warning message has been displayed
        const [warningHasElapsed, setWarningHasElapsed] = useState(false)

        useTimeout(() => {
            setWarningHasElapsed(true)
        }, ms)

        // If show is false the component will return null and stop here
        if (warningHasElapsed) {
            if (error) {
                clearErrors(error)
            }
            return null
        }

        // Otherwise, return warning
        return (
            <span className={style} role="alert">
                <UilExclamationTriangle className="mr-1 h-4" /> {message}
            </span>
        )
    }

    // Database hook to create account
    const createAccount = () => {
        if (!inputEmailRef.current.value) {
            setError(
                'email',
                { type: 'required', message: 'Missing email.' },
                { shouldFocus: true }
            )
            return false
        }

        if (!inputPasswordRef.current.value) {
            setError(
                'password',
                { type: 'required', message: 'Missing password.' },
                { shouldFocus: true }
            )
            return false
        }

        if (!inputPasswordRepRef.current.value) {
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
                    { type: 'required', message: 'Passwords do no match' },
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
                        .then((userCredential) => {
                            // Signed in: not much to do here,
                            // redirection happend on state change from the _app
                            const user = userCredential.user

                            // Create user profile
                            createUserProfile(user.uid, {
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
                        .catch((error) => {
                            console.log(error)
                        })
                }
            }
        }

        return true
    }

    const createAndGoToProfile = (e) => {
        e.preventDefault()
        const success = createAccount()
        if (success) {
            // goToProfile()
            router.push('/')
        }
    }

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
                    />
                </div>
                {/* Warning message on email */}
                {errors.email && errors.email.type === 'required' && (
                    <FlashErrorMessage
                        message={errors.email.message}
                        ms={warningTime}
                        style={loginInputs.formAlert}
                        error="email"
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
                        error="password"
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
                            error="passwordRep"
                        />
                    )}
                {/* Warning message on password repeat */}
                {errors.match && errors.match.type === 'required' && (
                    <FlashErrorMessage
                        message={errors.match.message}
                        ms={warningTime}
                        style={loginInputs.formAlert}
                        error="match"
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
