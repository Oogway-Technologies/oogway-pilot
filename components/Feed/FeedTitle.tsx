import { UilArrowLeft } from '@iconscout/react-unicons'
import { useRouter } from 'next/router'
import React from 'react'

import { setFeedState } from '../../features/utils/utilsSlice'
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux'
import { feedApiClass } from '../../styles/feed'
import Button from '../Utils/Button'

const FeedTitle = () => {
    // Track feed
    // Store selected feed in global state
    const feed = useAppSelector(state => state.utilsSlice.feedState)

    // Router for shallow routing to feeds
    const router = useRouter()

    return (
        <>
            {feed !== 'All' && (
                <div className={feedApiClass.feedToolbar}>
                    <span className={feedApiClass.feedTitle}>
                        <Button
                            icon={<UilArrowLeft />}
                            text={undefined}
                            forceNoText={true}
                            keepText={false}
                            addStyle={feedApiClass.backbutton}
                            type="button"
                            onClick={() => {
                                useAppDispatch(setFeedState('All'))
                                router.push('/?feed=All', undefined, {
                                    shallow: true,
                                })
                            }}
                        />
                        {`${feed}`}
                    </span>
                </div>
            )}
        </>
    )
}

export default FeedTitle
