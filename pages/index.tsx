import { useUser } from '@auth0/nextjs-auth0'
import Cookies from 'js-cookie'
import Head from 'next/head'
import React, { FC, useEffect, useState } from 'react'
import { FormProvider, useWatch } from 'react-hook-form'

import { SideNavbar } from '../components/Decision/AutoMatrix/SideNavbar'
import GenericSidebar from '../components/Decision/common/GenericSidebar'
import { DecisionBarHandler } from '../components/Decision/layout/DecisionBarHandler'
import { DecisionSideBar } from '../components/Decision/layout/DecisionSideBar'
import { DecisionTabWrapper } from '../components/Decision/layout/DecisionTabWrapper'
import OptionRatingTabWrapper from '../components/Decision/layout/OptionRatingTabWrapper'
import { CriteriaInfo } from '../components/Decision/SideCards/CriteriaInfo'
import { CriteriaSuggestions } from '../components/Decision/SideCards/CriteriaSuggestions'
import { DecisionHelperCard } from '../components/Decision/SideCards/DecisionHelperCard'
import { OptionSuggestions } from '../components/Decision/SideCards/OptionSuggestions'
import { ScoreCard } from '../components/Decision/SideCards/ScoreCard'
import { SignInCard } from '../components/Decision/SideCards/SignInCard'
import UnsupportedDecision from '../components/Decision/SideCards/UnsupportedDecision'
import { CriteriaTab } from '../components/Decision/Tabs/CriteriaTab'
import { DecisionTab } from '../components/Decision/Tabs/DecisionTab'
import MatrixResultTab from '../components/Decision/Tabs/MatrixResultTab'
import { OptionTab } from '../components/Decision/Tabs/OptionTab'
import { RatingTab } from '../components/Decision/Tabs/RatingTab'
import { ResultTab } from '../components/Decision/Tabs/ResultTab'
import FeedDisclaimer from '../components/Feed/Sidebar/FeedDisclaimer'
import useInstantiateDecisionForm from '../hooks/useInstantiateDecisionForm'
import useMediaQuery from '../hooks/useMediaQuery'
import { useAppSelector } from '../hooks/useRedux'
import useSaveDecisionFormState from '../hooks/useSaveDecisionFormState'
import { bigContainer, decisionContainer } from '../styles/decision'
import { decisionTitle } from '../utils/constants/global'
import { insertAtArray } from '../utils/helpers/common'

const DecisionEngine: FC = () => {
    const {
        decisionCriteriaQueryKey,
        userExceedsMaxDecisions,
        decisionEngineOptionTab,
        userIgnoredUnsafeWarning,
    } = useAppSelector(state => state.decisionSlice)
    const [currentTab, setCurrentTab] = useState(0)
    const [matrixStep, setMatrixStep] = useState(0)
    const deviceIp = Cookies.get('userIp')
    const isMobile = useMediaQuery('(max-width: 965px)')
    const { user } = useUser()

    // Instantiate form
    const methods = useInstantiateDecisionForm({ currentTab, setCurrentTab })
    const { control, getValues, setValue } = methods
    const watchQuestion = useWatch({ name: 'question', control })
    const optionList = getValues('options')
    const criteriaList = getValues('criteria')

    useEffect(() => {
        if (
            currentTab !== 4 &&
            currentTab !== 5 &&
            ((optionList && optionList[0].name) ||
                (criteriaList && criteriaList[0].name))
        ) {
            if (optionList && optionList[0].name) {
                setValue(
                    'options',
                    insertAtArray(optionList, 0, { name: '', isAI: false })
                )
            }
            if (criteriaList && criteriaList[0].name) {
                setValue(
                    'criteria',
                    insertAtArray(criteriaList, 0, {
                        name: '',
                        weight: 2,
                        isAI: false,
                    })
                )
            }
        }
    }, [currentTab])

    useSaveDecisionFormState()

    const matrixGenerator = () => {
        switch (matrixStep) {
            case 0:
                return (
                    <DecisionTab
                        currentTab={currentTab}
                        matrixStep={matrixStep}
                        setMatrixStep={setMatrixStep}
                        deviceIp={deviceIp || ''}
                    />
                )
            case 1:
                return (
                    <MatrixResultTab
                        setMatrixStep={setMatrixStep}
                        setCurrentTab={setCurrentTab}
                    />
                )
            default:
                return <div />
        }
    }

    const tabGenerator = () => {
        switch (currentTab) {
            case 1:
                return (
                    <DecisionTab
                        matrixStep={matrixStep}
                        setMatrixStep={setMatrixStep}
                        currentTab={currentTab}
                        deviceIp={deviceIp || ''}
                    />
                )
            case 2:
                return <OptionTab setCurrentTab={setCurrentTab} />
            case 3:
                return <CriteriaTab />
            case 4:
                return <RatingTab />
            case 5:
                return (
                    <ResultTab
                        setMatrixStep={setMatrixStep}
                        deviceIp={deviceIp || ''}
                        setCurrentTab={setCurrentTab}
                    />
                )
            default:
                return <div />
        }
    }

    return (
        <div className={isMobile ? 'flex flex-col h-[calc(100vh-121px)]' : ''}>
            <Head>
                <title>Oogway | Decision Engine</title>
            </Head>
            <FormProvider {...methods}>
                <form
                    className={`${decisionContainer} ${
                        isMobile ? `mx-4` : 'my-xl mx-xxl gap-4 h-[78vh]'
                    }`}
                    autoComplete="off"
                    onKeyDown={event => {
                        if (event.key === 'Enter') {
                            event.preventDefault()
                        }
                    }}
                >
                    {/* main body */}
                    <div
                        className={`${bigContainer} ${
                            isMobile
                                ? `col-span-4 ${
                                      currentTab === 0
                                          ? 'h-[calc(100vh-12.25rem)]'
                                          : 'h-[calc(100vh-15.5rem)]'
                                  }`
                                : 'col-span-3 h-max bg-white rounded-2xl shadow-md dark:bg-neutralDark-500 dark:shadow-black/60'
                        }`}
                    >
                        {!isMobile && currentTab > 0 && (
                            <DecisionSideBar
                                selectedTab={currentTab}
                                className="col-span-1"
                                setSelectedTab={setCurrentTab}
                            />
                        )}
                        {!isMobile && currentTab === 0 && (
                            <SideNavbar
                                selectedTab={matrixStep}
                                className="col-span-1"
                                setSelectedTab={setMatrixStep}
                            />
                        )}
                        <div
                            className={`flex flex-col gap-y-md ${
                                isMobile
                                    ? `col-span-7 pt-4 ${
                                          currentTab === 0
                                              ? 'h-[calc(100vh-12.25rem)]'
                                              : 'h-[calc(100vh-16rem)]'
                                      }`
                                    : 'col-span-6 px-5 py-4 h-full'
                            }`}
                        >
                            {currentTab === 4 && <OptionRatingTabWrapper />}
                            {currentTab === 4 && (
                                <span className="text-neutral-700 dark:text-neutralDark-150">
                                    Rate{' '}
                                    <span className="text-primary dark:text-primaryDark">
                                        {optionList &&
                                            optionList[decisionEngineOptionTab]
                                                .name}
                                    </span>{' '}
                                    on each criteria.
                                </span>
                            )}
                            <DecisionTabWrapper
                                title={decisionTitle[currentTab]}
                                currentTab={currentTab}
                                matrixStep={matrixStep}
                            >
                                {currentTab > 0
                                    ? tabGenerator()
                                    : matrixGenerator()}
                            </DecisionTabWrapper>
                            {!isMobile && currentTab > 0 && (
                                <DecisionBarHandler
                                    className="justify-self-end mt-auto w-full"
                                    selectedTab={currentTab}
                                    setSelectedTab={setCurrentTab}
                                />
                            )}
                        </div>
                    </div>
                    {!isMobile && (
                        <div
                            className={
                                'overflow-y-auto col-span-1 ' +
                                'scrollbar scrollbar-sm scrollbar-rounded scrollbar-thumb-tertiary ' +
                                'scrollbar-track-neutral-50 dark:scrollbar-thumb-primaryDark dark:scrollbar-track-neutralDark-300'
                            }
                        >
                            {!user ? (
                                !userExceedsMaxDecisions &&
                                !userIgnoredUnsafeWarning &&
                                (currentTab === 2 ||
                                    currentTab === 3 ||
                                    currentTab === 4) ? (
                                    <>
                                        {currentTab === 2 &&
                                            !userIgnoredUnsafeWarning && (
                                                <OptionSuggestions />
                                            )}
                                        {currentTab === 3 &&
                                            !userIgnoredUnsafeWarning && (
                                                <CriteriaSuggestions />
                                            )}
                                        {currentTab === 4 &&
                                            decisionCriteriaQueryKey && (
                                                <CriteriaInfo />
                                            )}
                                    </>
                                ) : (
                                    <SignInCard currentTab={currentTab} />
                                )
                            ) : (
                                !userIgnoredUnsafeWarning && (
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
                                )
                            )}
                            {currentTab === 1 &&
                            watchQuestion.split('').length ? (
                                <DecisionHelperCard />
                            ) : null}
                            {currentTab === 5 ? <ScoreCard /> : null}
                            {userIgnoredUnsafeWarning && (
                                <UnsupportedDecision
                                    setCurrentTab={setCurrentTab}
                                />
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
                {isMobile && currentTab > 0 && (
                    <DecisionBarHandler
                        className="justify-self-end pr-3 mt-auto w-full"
                        selectedTab={currentTab}
                        setSelectedTab={setCurrentTab}
                    />
                )}
                {/* step bar for mobile */}
                {isMobile && currentTab > 0 && (
                    <DecisionSideBar
                        selectedTab={currentTab}
                        className="col-span-1"
                        setSelectedTab={setCurrentTab}
                    />
                )}
                {isMobile && currentTab === 0 && (
                    <SideNavbar
                        selectedTab={matrixStep}
                        className="col-span-1"
                        setSelectedTab={setMatrixStep}
                    />
                )}
            </FormProvider>
        </div>
    )
}

export default DecisionEngine
