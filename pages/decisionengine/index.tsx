import { GetServerSideProps } from 'next'
import Head from 'next/head'
import React, { FC, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { DecisionBarHandler } from '../../components/Decision/layout/DecisionBarHandler'
import { DecisionSideBar } from '../../components/Decision/layout/DecisionSideBar'
import { DecisionTabWrapper } from '../../components/Decision/layout/DecisionTabWrapper'
import OptionRatingTabWrapper from '../../components/Decision/layout/OptionRatingTabWrapper'
import { CriteriaInfo } from '../../components/Decision/Sidecards/CriteriaInfo'
import { CriteriaSuggestions } from '../../components/Decision/Sidecards/CriteriaSuggestions'
import { OptionSuggestions } from '../../components/Decision/Sidecards/OptionSuggestions'
import { CriteriaTab } from '../../components/Decision/Tabs/CriteriaTab'
import { DecisionTab } from '../../components/Decision/Tabs/DecisionTab'
import { OptionTab } from '../../components/Decision/Tabs/OptionTab'
import { RatingTab } from '../../components/Decision/Tabs/RatingTab'
import { ResultTab } from '../../components/Decision/Tabs/ResultTab'
import useMediaQuery from '../../hooks/useMediaQuery'
import { useAppSelector } from '../../hooks/useRedux'
import { useCreateDecisionActivity } from '../../queries/decisionActivity'
import { bigContainer, decisionContainer } from '../../styles/decision'
import { decisionTitle } from '../../utils/constants/global'
import { FirebaseDecisionActivity } from '../../utils/types/firebase'
import { DecisionForm } from '../../utils/types/global'

interface DecisionEngineProps {
    deviceIp: string
}

const DecisionEngine: FC<DecisionEngineProps> = ({
    deviceIp,
}: DecisionEngineProps) => {
    const userProfile = useAppSelector(state => state.userSlice.user)
    const decisionCriteriaQueryKey = useAppSelector(
        state => state.decisionSlice.decisionCriteriaQueryKey
    )
    const decisionMutation = useCreateDecisionActivity()
    const [currentTab, setCurrentTab] = useState(1)

    const isMobile = useMediaQuery('(max-width: 965px)')
    // const { user, isLoading } = useUser()
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
    // handler functions
    const onSubmit = (data: any) => {
        const decisionActivity: FirebaseDecisionActivity = {
            userId: userProfile.uid,
            ...data,
        }
        decisionMutation.mutate(decisionActivity)
    }

    return (
        <div>
            <Head>
                <title>Oogway | Social - Wisdom of the crowd</title>
            </Head>
            <FormProvider {...methods}>
                <form
                    onSubmit={methods.handleSubmit(onSubmit)}
                    className={`${decisionContainer} ${
                        isMobile
                            ? 'my-2 mx-4 h-[82vh]'
                            : 'my-xl mx-xxl gap-4 h-[78vh]'
                    }`}
                    autoComplete="off"
                >
                    {isMobile && (
                        <DecisionSideBar
                            selectedTab={currentTab}
                            setSelectedTab={setCurrentTab}
                        />
                    )}
                    <div
                        className={`${bigContainer} ${
                            isMobile ? 'col-span-4' : 'col-span-3'
                        }`}
                    >
                        {!isMobile && (
                            <div
                                className={`col-span-1 pt-6 bg-primary/10 dark:bg-primaryDark/10`}
                                style={{
                                    borderTopLeftRadius: '16px',
                                    borderBottomLeftRadius: '16px',
                                }}
                            >
                                <DecisionSideBar
                                    selectedTab={currentTab}
                                    setSelectedTab={setCurrentTab}
                                />
                            </div>
                        )}

                        <div
                            className={`flex flex-col ${
                                isMobile
                                    ? 'col-span-4 mx-3 mb-4'
                                    : 'col-span-3 mr-5 pt-5 mb-6'
                            }`}
                        >
                            <div className="flex flex-col justify-between items-center space-y-xl h-full">
                                <div
                                    className={`overflow-auto relative py-2 w-full h-[60vh] scrollbar-hide`}
                                >
                                    {currentTab === 4 && (
                                        <OptionRatingTabWrapper />
                                    )}
                                    <DecisionTabWrapper
                                        title={decisionTitle[currentTab]}
                                        currentTab={currentTab}
                                    >
                                        <>
                                            {currentTab === 1 && (
                                                <DecisionTab />
                                            )}
                                            {currentTab === 2 && <OptionTab />}
                                            {currentTab === 3 && (
                                                <CriteriaTab />
                                            )}
                                            {currentTab === 4 && <RatingTab />}
                                            {currentTab === 5 && (
                                                <ResultTab
                                                    deviceIp={deviceIp}
                                                    setCurrentTab={
                                                        setCurrentTab
                                                    }
                                                />
                                            )}
                                        </>
                                    </DecisionTabWrapper>
                                </div>
                                {isMobile && (
                                    <div className={'w-full'}>
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
                            {/* {!isLoading &&
                            !user &&
                            (currentTab === 2 || currentTab === 3) ? (
                                <SignInCard />
                            ) : (
                                <>
                                    {currentTab === 2 && <OptionSuggestions />}
                                    {currentTab === 3 && (
                                        <CriteriaSuggestions />
                                    )}
                                </>
                            )} */}
                            {currentTab === 2 && <OptionSuggestions />}
                            {currentTab === 3 && <CriteriaSuggestions />}
                            {currentTab === 4 && decisionCriteriaQueryKey && (
                                <CriteriaInfo />
                            )}
                        </div>
                    )}
                </form>
            </FormProvider>
        </div>
    )
}

export default DecisionEngine

export const getServerSideProps: GetServerSideProps = async ({
    req: { cookies },
}) => {
    return {
        props: {
            deviceIp: cookies.user_ip,
        },
    }
}
