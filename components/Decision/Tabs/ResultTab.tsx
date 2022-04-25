import React from 'react'
import { FC } from 'react'

import { feedToolbarClass } from '../../../styles/feed'
import { bodyHeavy } from '../../../styles/typography'
import { ResultCard } from '../ResultCard'

export const ResultTab: FC = () => {
    return (
        <>
            <span
                className={`${bodyHeavy} text-neutral-700 mt-5 flex justify-start items-center mr-auto dark:text-neutralDark-150`}
            >
                Scores
            </span>
            <div className="flex items-center space-x-3">
                <ResultCard name="Santa Monica" points={102} />
                <ResultCard name="Charleston" points={102} />
            </div>
            <div className="flex items-center pt-5 space-x-6">
                <button className={feedToolbarClass.newPostButton}>
                    New Decision
                </button>
                <button className={feedToolbarClass.newPostButton}>
                    Get Feedback
                </button>
            </div>
        </>
    )
}
