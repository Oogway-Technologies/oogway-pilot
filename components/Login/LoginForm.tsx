import { FC, useEffect, useRef, useState } from 'react'
import firebase from 'firebase/compat/app'
import Button from '../Utils/Button'
import {
    UilEye,
    UilEyeSlash,
    UilExclamationTriangle,
} from '@iconscout/react-unicons'
import { loginButtons, loginDivs, loginInputs } from '../../styles/login'

// Form
import { useForm } from 'react-hook-form'
import { FlashErrorMessageProps } from '../Utils/FlashErrorMessage'
import useTimeout from '../../hooks/useTimeout'
import { useRouter } from 'next/router'

type LoginFormProps = {
    goToSignUp: () => void
    goToResetPW: () => void
    closeModal: () => void
}

const LoginForm: FC<LoginFormProps> = ({
    goToSignUp,
    goToResetPW,
    closeModal,
}) => {
    // Router
    const router = useRouter()

    const inputEmailRef = useRef(null)
    const inputPasswordRef = useRef(null)
    const [showPassword, setShowPassword] = useState(false)

    // Form management
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
        register('form', { required: true })
    }, [])

    const logIn = () => {
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

        if (inputEmailRef.current.value && inputPasswordRef.current.value) {
            firebase
                .auth()
                .signInWithEmailAndPassword(
                    inputEmailRef.current.value,
                    inputPasswordRef.current.value
                )
                .then((userCredential) => {
                    // Signed in: not much to do here
                    // redirection happend on shate change from the _app
                    const user = userCredential.user
                })
                .catch((e) => {
                    setError('form', {
                        type: 'required', // Actually a validation error, but since manually checking any will do
                        message:
                            'Either email or password are incorrect. Please retry.',
                    })
                })
        }

        // Clear the input
        inputPasswordRef.current.value = ''
        inputEmailRef.current.value = ''

        return true
    }

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

    const handleLogin = () => {
        const success = logIn()
        if (success) {
            closeModal()
            router.push('/')
        }
    }

    return (
        <div>
            <div className={loginDivs.modalHeader}>Login</div>
            <form className={loginDivs.signIn}>
                <div className={loginInputs.inputHeader}>Email</div>
                <div className={loginInputs.inputBorder}>
                    <input
                        className={loginInputs.inputField}
                        ref={inputEmailRef}
                        type="text"
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
                <div className={loginInputs.inputHeader}>Password</div>
                <div className={loginInputs.inputBorder}>
                    <input
                        className={loginInputs.inputField}
                        ref={inputPasswordRef}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
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
                <div className={loginDivs.customLink} onClick={goToResetPW}>
                    Forgot your password?
                </div>
            </form>
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
                    onClick={handleLogin}
                    addStyle={loginButtons.loginButtonStyle}
                    text="Login"
                    keepText={true}
                    forceNoText={false}
                    icon={null}
                    type="submit"
                />
            </div>
            {/* Warning message on email */}
            {errors.form && errors.form.type === 'required' && (
                <FlashErrorMessage
                    message={errors.form.message}
                    ms={warningTime}
                    style={loginInputs.formAlert}
                    error="form"
                />
            )}

            <div className={loginInputs.inputHeader}>
                Don't have an account?&nbsp;
                <div className={loginDivs.customLink} onClick={goToSignUp}>
                    Sign up
                </div>
            </div>
        </div>
    )
}

export default LoginForm
