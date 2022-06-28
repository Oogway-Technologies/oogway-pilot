import { useRouter } from 'next/router'
import React, { FC } from 'react'

import useMediaQuery from '../../../hooks/useMediaQuery'
import { bodyHeavy } from '../../../styles/typography'
import Button from '../../Utils/Button'

interface SignInCardProps {
    className?: string
    currentTab: number
}

export const SignInCard: FC<SignInCardProps> = ({
    className,
    currentTab,
}: SignInCardProps) => {
    const router = useRouter()
    const isMobile = useMediaQuery('(max-width: 965px)')

    const signIn = () => {
        router.push('/api/auth/login')
    }
    return (
        <div
            className={`flex flex-col ${
                isMobile
                    ? 'my-4'
                    : 'custom-box-shadow dark:custom-box-shadow-dark mb-4 rounded-2xl bg-white p-3 dark:bg-neutralDark-500'
            } ${className ? className : ''}`}
        >
            <span
                className={
                    'font-bold leading-6 text-primary text-base dark:text-primaryDark md:text-2xl'
                }
            >
                {currentTab === 1 ? 'Decision Progress' : 'AI suggestions'}
            </span>

            <span
                className={`${bodyHeavy} my-3 text-center font-normal text-neutral-700 dark:text-neutralDark-150`}
            >
                {currentTab === 1
                    ? 'Sign in to save progress and track your decisions.'
                    : 'Sign in to keep using AI and latest features.'}
            </span>

            <Button
                id="decisionProgress-SignIn"
                onClick={signIn}
                addStyle={`rounded-full w-full justify-center py-2 md:py-3 text-white bg-primary dark:bg-primaryDark hover:bg-primaryActive active:bg-primaryActive dark:hover:bg-primaryActive dark:active:bg-primaryActive font-bold mx-auto`}
                text="Sign In"
                keepText={true}
                icon={null}
                type="button"
            />
        </div>
    )
}
