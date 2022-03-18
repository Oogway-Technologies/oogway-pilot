import { UilArrowLeft } from '@iconscout/react-unicons'
import React from 'react'
import { useRecoilState } from 'recoil'

import { feedState } from '../../atoms/feeds'
import { feedApiClass } from '../../styles/feed'
import Button from '../Utils/Button'

const FeedTitle = () => {
    // Track feed
    const [feed, setFeed] = useRecoilState(feedState)
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
                            onClick={() => setFeed('All')}
                        />
                        {`${feed}`}
                    </span>
                </div>
            )}
        </>
    )
}

export default FeedTitle
