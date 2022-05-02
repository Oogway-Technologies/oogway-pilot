import Head from 'next/head'
import React, { FC, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { DecisionBarHandler } from '../components/Decision/DecisionBarHandler'
import { DecisionSideBar } from '../components/Decision/DecisionSideBar'
import { DecisionTabWrapper } from '../components/Decision/DecisionTabWrapper'
import OptionRatingTabWrapper from '../components/Decision/OptionRatingTabWrapper'
import { CriteriaSuggestions } from '../components/Decision/Sidecards/CriteriaSuggestions'
import { DecisionInfo } from '../components/Decision/Sidecards/DecisionInfo'
import { OptionSuggestions } from '../components/Decision/Sidecards/OptionSuggestions'
import { CriteriaTab } from '../components/Decision/Tabs/CriteriaTab'
import { DecisionTab } from '../components/Decision/Tabs/DecisionTab'
import { OptionTab } from '../components/Decision/Tabs/OptionTab'
import { RatingTab } from '../components/Decision/Tabs/RatingTab'
import { ResultTab } from '../components/Decision/Tabs/ResultTab'
import { useAppSelector } from '../hooks/useRedux'
import { useCreateDecisionActivity } from '../queries/decisionActivity'
import { bigContainer, decisionContainer } from '../styles/decision'
import { decisionInfoParagraph, decisionTitle } from '../utils/constants/global'
import { FirebaseDecisionActivity } from '../utils/types/firebase'
import { DecisionForm } from '../utils/types/global'

const DecisionEngine: FC = () => {
    const userProfile = useAppSelector(state => state.userSlice.user)
    const decisionMutation = useCreateDecisionActivity()
    const [currentTab, setCurrentTab] = useState(1)
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
                    className={decisionContainer}
                    autoComplete="off"
                >
                    <div className={bigContainer}>
                        <div
                            className={
                                'col-span-1 pt-6 bg-primary/10 dark:bg-primaryDark/10'
                            }
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
                        <div
                            className={
                                'flex flex-col col-span-3 pt-5 mr-5 mb-6'
                            }
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
                                                    setCurrentTab={
                                                        setCurrentTab
                                                    }
                                                />
                                            )}
                                        </>
                                    </DecisionTabWrapper>
                                </div>
                                <DecisionBarHandler
                                    className="justify-self-end mt-auto w-full"
                                    selectedTab={currentTab}
                                    setSelectedTab={setCurrentTab}
                                />
                            </div>
                        </div>
                    </div>
                    <div className={'col-span-1'}>
                        {currentTab === 1 && (
                            <DecisionInfo
                                title={'Decisions'}
                                paragraph={decisionInfoParagraph[0]}
                            />
                        )}
                        {currentTab === 2 && <OptionSuggestions />}
                        {currentTab === 3 && <CriteriaSuggestions />}
                        {currentTab === 4 ||
                            (currentTab === 5 && (
                                <DecisionInfo
                                    title={'Explanation'}
                                    paragraph={decisionInfoParagraph[1]}
                                />
                            ))}
                    </div>
                </form>
            </FormProvider>
        </div>
    )
}

export default DecisionEngine
