import { useUser } from '@auth0/nextjs-auth0'
import { useRouter } from 'next/router'
import React, { FC } from 'react'

import {
    setClickedConnect,
    setSideCardStep,
} from '../../../features/decision/decisionSlice'
import useMediaQuery from '../../../hooks/useMediaQuery'
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
    const isMobile = useMediaQuery('(max-width: 965px)')
    const router = useRouter()
    const step = useAppSelector(state => state.decisionSlice.sideCardStep)
    const { user, isLoading } = useUser()

    const buttonClass = `flex items-center text-center text-white bg-primary py-3 dark:bg-primaryDark rounded-lg w-full justify-center ${
        isMobile ? 'mt-4 self-center' : '-mt-14'
    } cursor-pointer hover:font-bold transition-all`

    const handleSignIn = () => {
        setSideCardStep(step + 1)
        router.push('/api/auth/login')
    }

    return (
        <div
            className={`custom-box-shadow dark:custom-box-shadow-dark mr-4 mb-4 flex flex-col rounded-2xl bg-white p-3 transition-all dark:bg-neutralDark-500 md:px-4 md:py-5 ${
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
                        className={`${body} mt-2 text-neutral-700 dark:text-neutralDark-150`}
                    >
                        Find a match that dealt with a similar decision and
                        wants to connect and share their insights and journey
                        with you.
                    </span>
                    {!isMobile ? <HappyGuy /> : null}
                    <Button
                        id={'decisionHelperCard-connectButton'}
                        keepText
                        text="Connect"
                        onClick={() => {
                            useAppDispatch(setSideCardStep(step + 1))
                            useAppDispatch(setClickedConnect(true))
                        }}
                        className={buttonClass}
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
                        className={`${body} mt-4 mb-6 text-center text-neutral-700 dark:text-neutralDark-150`}
                    >
                        Become a decision helper by sharing your experiences and
                        connecting with other decision makers
                    </span>
                    <Button
                        id={'decisionHelperCard-becomeDecisionHelperButton'}
                        keepText
                        text="Become a Decision Helper"
                        onClick={() => {
                            if (!isLoading && user) {
                                useAppDispatch(setSideCardStep(4))
                            } else {
                                useAppDispatch(setSideCardStep(step + 1))
                            }
                        }}
                        className={
                            'flex items-center text-center text-white bg-primary mt-6 ' +
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
                        className={`${body} mt-4 mb-6 text-center text-neutral-700 dark:text-neutralDark-150`}
                    >
                        Sign in or Create an Account <br /> to connect with
                        other
                        <br /> decision makers
                    </span>
                    <Button
                        id="decisionHelper-SignIn"
                        keepText
                        text="Create New Account"
                        onClick={handleSignIn}
                        className={
                            'flex items-center text-center text-white bg-primary mt-6 ' +
                            'dark:bg-primaryDark rounded-lg w-full py-3 justify-center cursor-pointer hover:font-bold transition-all'
                        }
                    />
                    <span
                        className={`${body} mx-auto mt-3 text-center text-neutral-800 dark:text-neutralDark-50`}
                    >
                        Already have an account?{' '}
                        <b
                            className="cursor-pointer transition-all hover:text-primary hover:dark:text-primaryDark"
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
                        className={`${body} mt-4 mb-6 text-center text-neutral-700 dark:text-neutralDark-150`}
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
