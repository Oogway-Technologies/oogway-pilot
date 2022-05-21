import Cookies from 'js-cookie'
import Head from 'next/head'
import React, { FC, useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import GenericSidebar from '../components/Decision/common/GenericSidebar'
import { DecisionBarHandler } from '../components/Decision/layout/DecisionBarHandler'
import { DecisionSideBar } from '../components/Decision/layout/DecisionSideBar'
import { DecisionTabWrapper } from '../components/Decision/layout/DecisionTabWrapper'
import OptionRatingTabWrapper from '../components/Decision/layout/OptionRatingTabWrapper'
import { CriteriaInfo } from '../components/Decision/Sidecards/CriteriaInfo'
import { CriteriaSuggestions } from '../components/Decision/Sidecards/CriteriaSuggestions'
import { OptionSuggestions } from '../components/Decision/Sidecards/OptionSuggestions'
import { SignInCard } from '../components/Decision/Sidecards/SignInCard'
import { CriteriaTab } from '../components/Decision/Tabs/CriteriaTab'
import { DecisionTab } from '../components/Decision/Tabs/DecisionTab'
import { OptionTab } from '../components/Decision/Tabs/OptionTab'
import { RatingTab } from '../components/Decision/Tabs/RatingTab'
import { ResultTab } from '../components/Decision/Tabs/ResultTab'
import FeedDisclaimer from '../components/Feed/Sidebar/FeedDisclaimer'
import {
    setDecisionQuestion,
    setUserExceedsMaxDecisions,
} from '../features/decision/decisionSlice'
import useMediaQuery from '../hooks/useMediaQuery'
import { useAppDispatch, useAppSelector } from '../hooks/useRedux'
import { bigContainer, decisionContainer } from '../styles/decision'
import { decisionTitle } from '../utils/constants/global'
import { DecisionForm } from '../utils/types/global'

const DecisionEngine: FC = () => {
    const decisionCriteriaQueryKey = useAppSelector(
        state => state.decisionSlice.decisionCriteriaQueryKey
    )
    const [currentTab, setCurrentTab] = useState(1)
    const isMobile = useMediaQuery('(max-width: 965px)')
    const deviceIp = Cookies.get('userIp')
    const [isPortrait, setIsPortrait] = useState(true)
    const userExceedsMaxDecisions = useAppSelector(
        state => state.decisionSlice.userExceedsMaxDecisions
    )

    const methods = useForm<DecisionForm>({
        defaultValues: {
            question: '',
            context: '',
            options: [
                { name: '', isAI: false },
                { name: '', isAI: false },
            ],
            criteria: [{ name: '', weight: 2, isAI: false }],
            ratings: [
                {
                    option: '',
                    score: '',
                    rating: [{ criteria: '', value: 0, weight: 1 }],
                },
            ],
        },
    })

    useEffect(() => {
        console.log(isPortrait)
        window.addEventListener(
            'orientationchange',
            () => {
                if (window.innerHeight > window.innerWidth) {
                    setIsPortrait(true)
                } else {
                    setIsPortrait(false)
                }
            },
            false
        )

        return () => {
            window.removeEventListener('orientationchange', () => {
                console.log('removed listener')
            })

            // Reset tracked decision question when user leaves
            useAppDispatch(setDecisionQuestion(undefined))
            useAppDispatch(setUserExceedsMaxDecisions(false))
        }
    }, [])

    const tabGenerator = () => {
        switch (currentTab) {
            case 1:
                return <DecisionTab deviceIp={deviceIp || ''} />
            case 2:
                return <OptionTab deviceIp={deviceIp || ''} />
            case 3:
                return <CriteriaTab />
            case 4:
                return <RatingTab />
            case 5:
                return (
                    <ResultTab
                        deviceIp={deviceIp || ''}
                        setCurrentTab={setCurrentTab}
                    />
                )
            default:
                return <div />
        }
    }

    return (
        <div>
            <Head>
                <title>Oogway | Decision Engine</title>
            </Head>
            <FormProvider {...methods}>
                <form
                    // onSubmit={methods.handleSubmit(onSubmit)}
                    className={`${decisionContainer} ${
                        isMobile
                            ? `mx-4 h-[100vh]`
                            : 'my-xl mx-xxl gap-4 h-[78vh]'
                    }`}
                    autoComplete="off"
                >
                    {/* main body */}
                    <div
                        className={`${bigContainer} ${
                            isMobile
                                ? 'col-span-4 h-[70vh]'
                                : 'col-span-3 h-full'
                        }`}
                    >
                        {!isMobile && (
                            <DecisionSideBar
                                selectedTab={currentTab}
                                className="col-span-1"
                            />
                        )}
                        <div
                            className={`flex flex-col py-4 px-5 ${
                                isMobile ? `col-span-7 ` : 'col-span-6'
                            }`}
                        >
                            <div
                                className={'flex flex-col items-center h-full'}
                            >
                                {currentTab === 4 && <OptionRatingTabWrapper />}
                                <DecisionTabWrapper
                                    title={decisionTitle[currentTab]}
                                    currentTab={currentTab}
                                >
                                    {tabGenerator()}
                                </DecisionTabWrapper>
                                {isMobile && (
                                    <div className={'mb-3 w-full'}>
                                        {userExceedsMaxDecisions &&
                                        (currentTab === 2 ||
                                            currentTab === 3 ||
                                            currentTab === 4) ? (
                                            <SignInCard />
                                        ) : (
                                            <>
                                                {currentTab === 2 && (
                                                    <OptionSuggestions />
                                                )}
                                                {currentTab === 3 && (
                                                    <CriteriaSuggestions />
                                                )}
                                                {currentTab === 4 &&
                                                    decisionCriteriaQueryKey && (
                                                        <CriteriaInfo />
                                                    )}
                                            </>
                                        )}
                                    </div>
                                )}
                                <DecisionBarHandler
                                    className="justify-self-end mt-auto w-full"
                                    selectedTab={currentTab}
                                    setSelectedTab={setCurrentTab}
                                />
                            </div>
                        </div>
                    </div>
                    {!isMobile && (
                        <div className={'col-span-1'}>
                            {userExceedsMaxDecisions &&
                            (currentTab === 2 ||
                                currentTab === 3 ||
                                currentTab === 4) ? (
                                <SignInCard />
                            ) : (
                                <>
                                    {currentTab === 2 && <OptionSuggestions />}
                                    {currentTab === 3 && (
                                        <CriteriaSuggestions />
                                    )}
                                    {currentTab === 4 &&
                                        decisionCriteriaQueryKey && (
                                            <CriteriaInfo />
                                        )}
                                </>
                            )}
                            <GenericSidebar
                                title="Disclaimer"
                                titleClass="text-md font-bold leading-6 text-neutral-700 dark:text-neutralDark-150"
                                extraClass="mt-auto"
                            >
                                <FeedDisclaimer />
                            </GenericSidebar>
                        </div>
                    )}
                </form>
            </FormProvider>

            {/* step bar for mobile */}
            {isMobile && (
                <DecisionSideBar
                    selectedTab={currentTab}
                    className="col-span-1"
                />
            )}
        </div>
    )
}

export default DecisionEngine
