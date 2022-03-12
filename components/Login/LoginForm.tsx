import { UilEye, UilEyeSlash } from '@iconscout/react-unicons'
import firebase from 'firebase/compat/app'
import { useRouter } from 'next/router'
import { FC, useEffect, useRef, useState } from 'react'
// Form
import { useForm } from 'react-hook-form'

import { loginButtons, loginDivs, loginInputs } from '../../styles/login'
import preventDefaultOnEnter from '../../utils/helpers/preventDefaultOnEnter'
import Button from '../Utils/Button'
import FlashErrorMessage from '../Utils/FlashErrorMessage'

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

    const inputEmailRef = useRef<HTMLInputElement>(null)
    const inputPasswordRef = useRef<HTMLInputElement>(null)
    const [showPassword, setShowPassword] = useState(false)

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
    useEffect(() => {
        register('password', { required: true })
    }, [])
    useEffect(() => {
        register('form', { required: true })
    }, [])

    const logIn = () => {
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

        firebase
            .auth()
            .signInWithEmailAndPassword(
                inputEmailRef.current.value,
                inputPasswordRef.current.value
            )
            .then()
            .catch(() => {
                setError('form', {
                    type: 'required', // Actually a validation error, but since manually checking any will do
                    message:
                        'Either email or password are incorrect. Please retry.',
                })
            })

        // Clear the input
        inputPasswordRef.current.value = ''
        inputEmailRef.current.value = ''

        return true
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
                <div className={loginInputs.inputHeader}>Password</div>
                <div className={loginInputs.inputBorder}>
                    <input
                        className={loginInputs.inputField}
                        ref={inputPasswordRef}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
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
                />
            )}

            <div className={loginInputs.inputHeader}>
                {`Don't have an account?`}&nbsp;
                <div className={loginDivs.customLink} onClick={goToSignUp}>
                    Sign up
                </div>
            </div>
        </div>
    )
}

export default LoginForm
