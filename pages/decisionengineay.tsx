import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import Head from 'next/head'
import { ParsedUrlQuery } from 'querystring'
import React, { FC, useState } from 'react'

import { DecisionBarHandler } from '../components/Decision/DecisionBarHandler'
import { DecisionInfo } from '../components/Decision/DecisionInfo'
import { DecisionSideBar } from '../components/Decision/DecisionSideBar'
import { DecisionTabWrapper } from '../components/Decision/DecisionTabWrapper'
import { CriteriaTab } from '../components/Decision/Tabs/CriteriaTab'
import { OptionTab } from '../components/Decision/Tabs/OptionTab'
import { QuestionTab } from '../components/Decision/Tabs/QuestionTab'
import { RatingTab } from '../components/Decision/Tabs/RatingTab'
import { ResultTab } from '../components/Decision/Tabs/ResultTab'
import { bigContainer, decisionContainer } from '../styles/decision'
import { bodyHeavy } from '../styles/typography'
import { decisionInfoParagraph, decisionTitle } from '../utils/constants/global'

const DecisionEngineay: FC = () => {
    const [currentTab, setCurrentTab] = useState(1)
    const [selectedTab, setSelectedTab] = useState(0)

    return (
        <div>
            <Head>
                <title>Oogway | Social - Wisdom of the crowd</title>
            </Head>

            <div className={decisionContainer}>
                <div className={bigContainer}>
                    <div
                        className={'col-span-1 pt-6'}
                        style={{
                            background: '#EFEAFF',
                            borderTopLeftRadius: '16px',
                            borderBottomLeftRadius: '16px',
                        }}
                    >
                        <DecisionSideBar
                            selectedTab={currentTab}
                            setSelectedTab={setCurrentTab}
                        />
                    </div>
                    <div className={'flex flex-col col-span-3 pt-5 mr-5'}>
                        {currentTab === 4 && (
                            <div className="flex items-center mb-3 w-full">
                                {Array(2)
                                    .fill(0)
                                    .map((item, index) => {
                                        return (
                                            <span
                                                key={item + index}
                                                onClick={() =>
                                                    setSelectedTab(index)
                                                }
                                                className={`${bodyHeavy} py-3 w-full flex items-center justify-center transition-all border-b-2 border-transparent ${
                                                    selectedTab === index
                                                        ? 'text-primary border-primary'
                                                        : 'font-normal text-neutral-700'
                                                } cursor-pointer`}
                                            >
                                                Santa Monica
                                            </span>
                                        )
                                    })}
                            </div>
                        )}
                        <DecisionTabWrapper title={decisionTitle[currentTab]}>
                            <>
                                {currentTab === 1 && <QuestionTab />}
                                {currentTab === 2 && <OptionTab />}
                                {currentTab === 3 && <CriteriaTab />}
                                {currentTab === 4 && <RatingTab />}
                                {currentTab === 5 && <ResultTab />}
                            </>
                        </DecisionTabWrapper>

                        <DecisionBarHandler
                            className="justify-self-end mt-auto mb-6 w-full"
                            selectedTab={currentTab}
                            setSelectedTab={setCurrentTab}
                        />
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

export const getServerSideProps: GetServerSideProps = async (
    context: GetServerSidePropsContext<
        ParsedUrlQuery,
        string | false | object | undefined
    >
) => {
    return {
        props: {},
    }
}
