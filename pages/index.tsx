import { useUser } from '@auth0/nextjs-auth0'
import Cookies from 'js-cookie'
import Head from 'next/head'
import React, { FC, useEffect, useState } from 'react'
import { FormProvider, useWatch } from 'react-hook-form'

import GenericSidebar from '../components/Decision/common/GenericSidebar'
import { DecisionBarHandler } from '../components/Decision/layout/DecisionBarHandler'
import { DecisionSideBar } from '../components/Decision/layout/DecisionSideBar'
import { DecisionTabWrapper } from '../components/Decision/layout/DecisionTabWrapper'
import OptionRatingTabWrapper from '../components/Decision/layout/OptionRatingTabWrapper'
import { CriteriaInfo } from '../components/Decision/Sidecards/CriteriaInfo'
import { CriteriaSuggestions } from '../components/Decision/Sidecards/CriteriaSuggestions'
import { DecisionHelperCard } from '../components/Decision/Sidecards/DecisionHelperCard'
import { OptionSuggestions } from '../components/Decision/Sidecards/OptionSuggestions'
import { SignInCard } from '../components/Decision/Sidecards/SignInCard'
import { CriteriaTab } from '../components/Decision/Tabs/CriteriaTab'
import { DecisionTab } from '../components/Decision/Tabs/DecisionTab'
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
    const { decisionCriteriaQueryKey, userExceedsMaxDecisions } =
        useAppSelector(state => state.decisionSlice)
    const [currentTab, setCurrentTab] = useState(1)
    const deviceIp = Cookies.get('userIp')
    const isMobile = useMediaQuery('(max-width: 965px)')
    const { user } = useUser()

    // Instantiate form
    const methods = useInstantiateDecisionForm({ currentTab, setCurrentTab })
    const { control, getValues, setValue } = methods
    const watchQuestion = useWatch({ name: 'question', control })

    useEffect(() => {
        const optionList = getValues('options')
        const criteriaList = getValues('criteria')
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

    // On page unmoount, save form state
    useSaveDecisionFormState()

    const tabGenerator = () => {
        switch (currentTab) {
            case 1:
                return <DecisionTab deviceIp={deviceIp || ''} />
            case 2:
                return <OptionTab />
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
        <div className={isMobile ? 'flex flex-col h-[calc(100vh-121px)]' : ''}>
            <Head>
                <title>Oogway | Decision Engine</title>
            </Head>
            <FormProvider {...methods}>
                <form
                    // onSubmit={methods.handleSubmit(onSubmit)}
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
                                ? 'col-span-4 h-[70vh]'
                                : 'col-span-3 h-max bg-white rounded-2xl shadow-md dark:bg-neutralDark-500 dark:shadow-black/60'
                        }`}
                    >
                        {!isMobile && (
                            <DecisionSideBar
                                selectedTab={currentTab}
                                className="col-span-1"
                                setSelectedTab={setCurrentTab}
                            />
                        )}
                        <div
                            className={`flex flex-col  ${
                                isMobile
                                    ? `col-span-7 pt-4`
                                    : 'col-span-6 px-5 py-4'
                            }`}
                        >
                            <div
                                className={
                                    'flex flex-col gap-y-md items-center h-full'
                                }
                            >
                                {currentTab === 4 && <OptionRatingTabWrapper />}
                                <DecisionTabWrapper
                                    title={decisionTitle[currentTab]}
                                    currentTab={currentTab}
                                >
                                    {tabGenerator()}
                                </DecisionTabWrapper>
                                {!isMobile && (
                                    <DecisionBarHandler
                                        className="justify-self-end mt-auto w-full"
                                        selectedTab={currentTab}
                                        setSelectedTab={setCurrentTab}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                    {!isMobile && (
                        <div className={'col-span-1'}>
                            {!user ? (
                                !userExceedsMaxDecisions &&
                                (currentTab === 2 ||
                                    currentTab === 3 ||
                                    currentTab === 4) ? (
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
                                ) : (
                                    <SignInCard />
                                )
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
                            {currentTab === 1 &&
                            watchQuestion.split('').length ? (
                                <DecisionHelperCard />
                            ) : null}
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
                {isMobile && (
                    <DecisionBarHandler
                        className="justify-self-end pr-3 mt-auto w-full"
                        selectedTab={currentTab}
                        setSelectedTab={setCurrentTab}
                    />
                )}
                {/* step bar for mobile */}
                {isMobile && (
                    <DecisionSideBar
                        selectedTab={currentTab}
                        className="col-span-1"
                        setSelectedTab={setCurrentTab}
                    />
                )}
            </FormProvider>
        </div>
    )
}

export default DecisionEngine
