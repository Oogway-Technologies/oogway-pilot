import { useUser } from '@auth0/nextjs-auth0'
import { useRouter } from 'next/router'
import React, { FC } from 'react'
import { useFormContext } from 'react-hook-form'

import { setSideCardStep } from '../../../features/decision/decisionSlice'
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import { body, bodyHeavy } from '../../../styles/typography'
import { FileSVG, HappyGuy } from '../../../utils/icons/CustomIcons'
import Button from '../../Utils/Button'

interface DecisionHelperCardProps {
    className?: string
}
export const DecisionHelperCard: FC<DecisionHelperCardProps> = ({
    className,
}: DecisionHelperCardProps) => {
    const step = useAppSelector(state => state.decisionSlice.sideCardStep)
    const { setValue } = useFormContext()
    const router = useRouter()
    const { user, isLoading } = useUser()

    const handleSignIn = () => {
        setSideCardStep(step + 1)
        router.push('/api/auth/login')
    }

    return (
        <div
            className={`flex flex-col bg-white rounded-2xl px-4 py-5 dark:bg-neutralDark-500 mb-4 custom-box-shadow dark:custom-box-shadow-dark transition-all ${
                className ? className : ''
            }`}
        >
            {step === 1 && (
                <>
                    <span
                        className={`${bodyHeavy} text-neutral-800 dark:text-neutralDark-50`}
                    >
                        Oogway Connect
                    </span>
                    <span
                        className={`${body} text-neutral-700 dark:text-neutralDark-150 mt-2`}
                    >
                        Find a match that dealt with a similar decision and
                        wants to connect and share their insights and journey
                        with you.
                    </span>
                    <HappyGuy />
                    <Button
                        text="Connect"
                        onClick={() => {
                            useAppDispatch(setSideCardStep(step + 1))
                        }}
                        addStyle={
                            'flex items-center text-center text-white bg-primary ' +
                            'dark:bg-primaryDark rounded-lg w-full py-3 justify-center -mt-14 cursor-pointer hover:font-bold transition-all'
                        }
                    />
                </>
            )}
            {step === 2 && (
                <>
                    <span
                        className={`${bodyHeavy} text-center text-neutral-800 dark:text-neutralDark-50`}
                    >
                        No matches found yet
                    </span>
                    <span
                        className={`${body} text-center text-neutral-700 dark:text-neutralDark-150 mt-4 mb-6`}
                    >
                        Become a decision helper by sharing your experiences and
                        connecting with other decision makers
                    </span>
                    <Button
                        text="Become a Decision Helper"
                        onClick={() => {
                            if (!isLoading && user) {
                                useAppDispatch(setSideCardStep(4))
                            } else {
                                useAppDispatch(setSideCardStep(step + 1))
                            }
                            setValue('clickedConnect', true)
                        }}
                        addStyle={
                            'flex items-center text-center text-white bg-primary mt-6' +
                            'dark:bg-primaryDark rounded-lg w-full py-3 justify-center cursor-pointer hover:font-bold transition-all'
                        }
                    />
                </>
            )}
            {step === 3 && (
                <>
                    <span
                        className={`${bodyHeavy} text-center text-neutral-800 dark:text-neutralDark-50`}
                    >
                        Oogway Connect
                    </span>
                    <span
                        className={`${body} text-center text-neutral-700 dark:text-neutralDark-150 mt-4 mb-6`}
                    >
                        Sign in or Create an Account <br /> to connect with
                        other
                        <br /> decision makers
                    </span>
                    <Button
                        text="Create New Account"
                        onClick={handleSignIn}
                        addStyle={
                            'flex items-center text-center text-white bg-primary mt-6' +
                            'dark:bg-primaryDark rounded-lg w-full py-3 justify-center cursor-pointer hover:font-bold transition-all'
                        }
                    />
                    <span
                        className={`${body} text-neutral-800 dark:text-neutralDark-50 mt-3 text-center mx-auto`}
                    >
                        Already have an account?{' '}
                        <b
                            className="hover:text-primary hover:dark:text-primaryDark transition-all cursor-pointer"
                            onClick={handleSignIn}
                        >
                            Sign in
                        </b>
                    </span>
                </>
            )}
            {step === 4 && (
                <>
                    <FileSVG />
                    <span
                        className={`${body} text-center text-neutral-700 dark:text-neutralDark-150 mt-4 mb-6`}
                    >
                        You’ve opted to become a decision <br /> helper. We will
                        notify you when you <br />
                        have a new match!
                    </span>
                </>
            )}
        </div>
    )
}
