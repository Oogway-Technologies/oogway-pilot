import { FC, useState } from 'react'

// JSX
import LoginForm from '../Forms/LoginForm'
import PWForm from '../Forms/PWForm'
import SignUpForm from '../Forms/SignupForm'

type AuthenticationAPIProps = {
    closeModal: () => void
}

const AuthenticationAPI: FC<AuthenticationAPIProps> = ({ closeModal }) => {
    const [step, setStep] = useState('login')

    // Step switching functions
    const setSignupStep = () => {
        setStep('signup')
    }
    const setLoginStep = () => {
        setStep('login')
    }
    const setResetStep = () => {
        setStep('resetpw')
    }
    const setProfileStep = () => {
        setStep('profile')
    }

    switch (step) {
        case 'login':
            return (
                <LoginForm
                    goToSignUp={setSignupStep}
                    goToResetPW={setResetStep}
                    closeModal={closeModal}
                />
            )
        case 'signup':
            return (
                <SignUpForm
                    goToLogin={setLoginStep}
                    goToProfile={setProfileStep}
                    closeModal={closeModal}
                />
            )
        case 'resetpw':
            return <PWForm goToLogin={setLoginStep} closeModal={closeModal} />
        // case 'profile':
        //     return <UserProfileForm closeModal={closeModal} />
        default:
            return null
        // do nothing
    }
}

export default AuthenticationAPI
