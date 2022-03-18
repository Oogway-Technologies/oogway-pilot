import React, { FC } from 'react'
import { useRecoilState } from 'recoil'

import { feedState } from '../../atoms/feeds'
import { useFeedsQuery } from '../../queries/feeds'
import { feedSelectorClass } from '../../styles/feed'
import { FeedSelectorLoader } from '../Loaders/FeedSelectorLoader'
import SidebarWidget from '../Utils/SidebarWidget'

const FeedSelector: FC = () => {
    // Track feed categories
    const { data: feedCategories, status } = useFeedsQuery()

    // Store selected feed in global state
    const [feed, setFeed] = useRecoilState(feedState)

    return (
        <SidebarWidget title={'Jump to a Feed'}>
            {status === 'loading' ? (
                <FeedSelectorLoader />
            ) : status === 'error' ? (
                // TODO: need nicer error component
                <div>Error: loading posts.</div>
            ) : (
                <ul className={feedSelectorClass.list}>
                    {feedCategories &&
                        feedCategories.feeds.map(elem => {
                            return (
                                <li
                                    key={elem.id}
                                    className={
                                        feedSelectorClass.feed +
                                        (elem.label == feed
                                            ? feedSelectorClass.feedActive
                                            : feedSelectorClass.feedInactive) +
                                        ' buttonText'
                                    }
                                    data-text={elem.label}
                                    onClick={() => setFeed(elem.label)}
                                >
                                    {elem.label}
                                </li>
                            )
                        })}
                </ul>
            )}
        </SidebarWidget>
    )
}

export default FeedSelector
