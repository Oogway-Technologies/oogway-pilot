import { useRouter } from 'next/router'
import React, { FC } from 'react'

import { loginButtons } from '../../../styles/login'
import { bodyHeavy, bodySmall } from '../../../styles/typography'
import Button from '../../Utils/Button'

interface SignInCardProps {
    className?: string
}

export const SignInCard: FC<SignInCardProps> = ({
    className,
}: SignInCardProps) => {
    const router = useRouter()

    const signIn = () => {
        router.push('/api/auth/login')
    }
    return (
        <div
            className={`flex flex-col bg-white rounded-2xl shadow-md p-3 dark:bg-neutralDark-500 dark:shadow-black/60 items-center  ${
                className ? className : ''
            }`}
        >
            <span
                className={`${bodyHeavy} mb-1 mt-2 text-neutral-700 dark:text-neutralDark-150 text-center`}
            >
                Curious to see what the AI suggests based on your question?
            </span>
            <span
                className={`${bodySmall} mb-4 text-neutral-700 dark:text-neutralDark-150`}
            >
                Sign in to find out
            </span>
            <Button
                onClick={signIn}
                addStyle={`${loginButtons.loginButtonWFullStyle} w-40`}
                text="Sign In"
                keepText={true}
                icon={null}
                type="button"
            />
        </div>
    )
}
