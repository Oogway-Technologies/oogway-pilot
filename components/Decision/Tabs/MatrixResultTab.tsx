import React from 'react'

import { useAppSelector } from '../../../hooks/useRedux'
// import { feedToolbarClass } from '../../../styles/feed'
import { body } from '../../../styles/typography'
import { ResultChart } from '../common/ResultChart'
import { ResultTable } from '../common/ResultTable'

const MatrixResultTab = () => {
    const { decisionEngineBestOption, isThereATie } = useAppSelector(
        state => state.decisionSlice
    )

    return (
        <div className="flex flex-col mb-3 space-y-3">
            <ResultTable />
            <div className="flex flex-col my-4 mb-3 space-y-1 text-center">
                {isThereATie ? (
                    <>
                        <span
                            className={`text-xl font-bold tracking-normal leading-10 text-center text-neutral-800 dark:text-white`}
                        >
                            It’s a tie!
                        </span>
                        <span
                            className={`${body} text-neutral-700 dark:text-neutralDark-150`}
                        >
                            We’ve randomly picked{' '}
                            <b className="text-primary dark:text-primaryDark">
                                {decisionEngineBestOption}
                            </b>
                            .
                        </span>
                        <span
                            className={`${body} text-neutral-700 dark:text-neutralDark-150`}
                        >
                            Refine{' '}
                            <b className="text-primary dark:text-primaryDark">
                                rating
                            </b>{' '}
                            for criteria to get a more accurate result.
                        </span>
                    </>
                ) : (
                    <>
                        <span
                            className={`${body} text-neutral-700 dark:text-neutralDark-150`}
                        >
                            Your best option is
                        </span>
                        <span className="text-3xl font-bold tracking-normal leading-10 text-center text-primary dark:text-primaryDark">
                            {decisionEngineBestOption}
                        </span>
                    </>
                )}
            </div>
            <ResultChart />
            <div className="flex items-center py-4 mx-auto space-x-4">
                {/* <button
                    onClick={() => {
                        console.log('')
                    }}
                    className={feedToolbarClass.newPostButton}
                >
                    New Decision
                </button> */}
                {/* <button
            className={feedToolbarClass.newPostButton}
            onClick={() => console.log(getValues())}
        >
            Get Feedback
        </button> */}
            </div>
        </div>
    )
}

export default MatrixResultTab
