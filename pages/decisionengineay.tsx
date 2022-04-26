import Head from 'next/head'
import React, { FC, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { DecisionBarHandler } from '../components/Decision/DecisionBarHandler'
import { DecisionInfo } from '../components/Decision/DecisionInfo'
import { DecisionSideBar } from '../components/Decision/DecisionSideBar'
import { DecisionTabWrapper } from '../components/Decision/DecisionTabWrapper'
import OptionRatingTabWrapper from '../components/Decision/OptionRatingTabWrapper'
import { CriteriaTab } from '../components/Decision/Tabs/CriteriaTab'
import { OptionTab } from '../components/Decision/Tabs/OptionTab'
import { QuestionTab } from '../components/Decision/Tabs/QuestionTab'
import { RatingTab } from '../components/Decision/Tabs/RatingTab'
import { ResultTab } from '../components/Decision/Tabs/ResultTab'
import { useAppSelector } from '../hooks/useRedux'
import { useCreateDecisionActivity } from '../queries/decisionActivity'
import { bigContainer, decisionContainer } from '../styles/decision'
import { decisionInfoParagraph, decisionTitle } from '../utils/constants/global'
import { FirebaseDecisionActivity } from '../utils/types/firebase'

const DecisionEngineay: FC = () => {
    const userProfile = useAppSelector(state => state.userSlice.user)
    const decisionMutation = useCreateDecisionActivity()
    const [currentTab, setCurrentTab] = useState(1)
    const methods = useForm({
        defaultValues: {
            question: '',
            context: '',
            options: [{ name: '', score: 0 }],
            criteria: [{ name: '', weight: 1, rating: [5] }],
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

            <div className={decisionContainer}>
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
                    {/* This needs to move into the formm so we can link the options with each of their ratings */}
                    <div className={'flex flex-col col-span-3 pt-5 mr-5 mb-6'}>
                        <FormProvider {...methods}>
                            <form
                                onSubmit={methods.handleSubmit(onSubmit)}
                                className="flex overflow-auto flex-col justify-between items-center space-y-xl h-full"
                            >
                                <div className="w-full">
                                    {currentTab === 4 && (
                                        <OptionRatingTabWrapper />
                                    )}
                                    <DecisionTabWrapper
                                        title={decisionTitle[currentTab]}
                                        currentTab={currentTab}
                                    >
                                        <>
                                            {currentTab === 1 && (
                                                <QuestionTab />
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
                            </form>
                        </FormProvider>
                    </div>
                </div>
                <div className={'col-span-1'}>
                    <DecisionInfo
                        className="ml-3"
                        title={currentTab === 1 ? 'Decisions' : 'Explanation'}
                        paragraph={
                            decisionInfoParagraph[
                                currentTab === 1 || currentTab === 2 ? 0 : 1
                            ]
                        }
                    />
                </div>
            </div>
        </div>
    )
}

export default DecisionEngineay
