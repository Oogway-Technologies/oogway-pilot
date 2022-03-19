import { Popover, Transition } from '@headlessui/react'
import { UilAngleDown, UilAngleUp } from '@iconscout/react-unicons'
import React, { FC, Fragment, useState } from 'react'
import { usePopper } from 'react-popper'
import { useRecoilState } from 'recoil'

import { feedState } from '../../atoms/feeds'
import { useFeedsQuery } from '../../queries/feeds'
import { feedSelectorClass, feedToolbarClass } from '../../styles/feed'
import { sidebarWidget } from '../../styles/utils'
import { FeedSelectorLoader } from '../Loaders/FeedSelectorLoader'

const FeedSelector: FC = () => {
    // Track feed categories
    const { data: feedCategories, status } = useFeedsQuery()

    // Store selected feed in global state
    const [feed, setFeed] = useRecoilState(feedState)

    const errorMessage = (
        // TODO: need nicer error component
        <div>Error: loading posts.</div>
    )

    return (
        <>
            {status === 'loading' ? (
                <FeedSelectorLoader />
            ) : status === 'error' ? (
                { errorMessage }
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
        </>
    )
}

export const FeedSelectorMobile: FC = () => {
    const [referenceElement, setReferenceElement] = useState(null)
    const [popperElement, setPopperElement] = useState(null)
    const { styles, attributes } = usePopper(referenceElement, popperElement)

    // Update popper location
    styles.popper = {
        position: 'absolute',
        right: '0',
        bottom: '1',
    }

    // Track feed categories
    const { data: feedCategories, status } = useFeedsQuery()

    // Store selected feed in global state
    const [feed, setFeed] = useRecoilState(feedState)

    const errorMessage = (
        // TODO: need nicer error component
        <div>Error: loading posts.</div>
    )

    const title = <div className={sidebarWidget.title}>Jump to a Feed</div>

    return (
        <Popover as="div">
            {({ open }) => (
                <>
                    <Popover.Button
                        className={feedToolbarClass.feedButton}
                        ref={setReferenceElement as unknown as string}
                    >
                        <div className={feedSelectorClass.dropdownButton}>
                            Feeds{' '}
                            <span>
                                {open ? <UilAngleDown /> : <UilAngleUp />}
                            </span>
                        </div>
                    </Popover.Button>
                    <Transition
                        as={Fragment}
                        enter="transition duration-100 ease-out"
                        enterFrom="transform scale-95 opacity-0"
                        enterTo="transform scale-100 opacity-100"
                        leave="transition duration-75 ease-in"
                        leaveFrom="transform scale-100 opacity-100"
                        leaveTo="transform scale-95 opacity-0"
                    >
                        <Popover.Panel
                            as="div"
                            className={feedSelectorClass.dropdown}
                            ref={setPopperElement as unknown as string}
                            style={styles.popper}
                            {...attributes.popper}
                        >
                            {status === 'loading' ? (
                                <>
                                    {title}
                                    <FeedSelectorLoader />
                                </>
                            ) : status === 'error' ? (
                                <>
                                    {title}
                                    {errorMessage}
                                </>
                            ) : (
                                ({ close }) => (
                                    <ul className="w-full">
                                        {feedCategories?.feeds.map(elem => {
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
                                                    onClick={() => {
                                                        setFeed(elem.label)
                                                        close()
                                                    }}
                                                >
                                                    {elem.label}
                                                </li>
                                            )
                                        })}
                                    </ul>
                                )
                            )}
                        </Popover.Panel>
                    </Transition>
                </>
            )}
        </Popover>
    )
}

export default FeedSelector
