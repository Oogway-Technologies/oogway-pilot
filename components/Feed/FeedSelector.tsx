import { Popover, Transition } from '@headlessui/react'
import {
    UilAngleDown,
    UilAngleRight,
    UilEstate,
    UilTimes,
} from '@iconscout/react-unicons'
import { useRouter } from 'next/router'
import React, { FC, Fragment, useState } from 'react'
import { usePopper } from 'react-popper'

import { setFeedState } from '../../features/utils/utilsSlice'
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux'
import { useFeedsQuery } from '../../queries/feeds'
import { feedSelectorClass, feedToolbarClass } from '../../styles/feed'
import { sidebarWidget } from '../../styles/utils'
import { FeedSelectorLoader } from '../Loaders/FeedSelectorLoader'
import Button from '../Utils/Button'
import { Collapse } from '../Utils/common/Collapse'

interface FeedSelectorProps {
    feedClickHandler?: () => void
}

export const FeedSelector: FC<FeedSelectorProps> = ({ feedClickHandler }) => {
    // Track feed categories
    const { data: feedCategories, status } = useFeedsQuery()

    // Router for shallow routing to feeds
    const router = useRouter()

    // Store selected feed in global state
    const feed = useAppSelector(state => state.utilsSlice.feedState)

    const errorMessage = (
        // TODO: need nicer error component
        <div>Error loading feeds.</div>
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
                                    onClick={() => {
                                        useAppDispatch(setFeedState(elem.label))
                                        router.push(
                                            `/?feed=${elem.label}`,
                                            undefined,
                                            { shallow: true }
                                        )
                                        if (feedClickHandler) feedClickHandler()
                                    }}
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

    // Router for shallow routing to feeds
    const router = useRouter()

    // Store selected feed in global state
    const feed = useAppSelector(state => state.utilsSlice.feedState)
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
                            <span>
                                {open ? <UilAngleRight /> : <UilAngleDown />}
                            </span>{' '}
                            Feeds
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
                                                        useAppDispatch(
                                                            setFeedState(
                                                                elem.label
                                                            )
                                                        )
                                                        router.push(
                                                            `/?feed=${elem.label}`,
                                                            undefined,
                                                            { shallow: true }
                                                        )
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

export const FeedSelectorMenu: FC = () => {
    // Track collapse
    const [expanded, setExpanded] = useState<boolean>(false)

    // Router for shallow routing to feeds
    const router = useRouter()

    // Store selected feed in global state
    const feed = useAppSelector(state => state.utilsSlice.feedState)

    return (
        <div className="flex flex-col m-sm w-64">
            {/* Home Button */}
            <Button
                text="Home"
                keepText={false}
                icon={<UilEstate />}
                type="button"
                addStyle={
                    feedToolbarClass.leftTabButtons +
                    (feed == 'All'
                        ? feedToolbarClass.leftTabActive
                        : feedToolbarClass.leftTabInactive) +
                    ' mb-sm'
                }
                onClick={() => {
                    useAppDispatch(setFeedState('All'))
                    router.push('/?feed=All', undefined, {
                        shallow: true,
                    })
                }}
            />
            {/* Feed Selector Button */}
            <Button
                text="Select Feed"
                keepText={true}
                icon={expanded ? <UilAngleRight /> : <UilAngleDown />}
                type="button"
                addStyle={
                    feedToolbarClass.leftTabButtons +
                    (expanded
                        ? feedToolbarClass.leftTabActive
                        : feedToolbarClass.leftTabInactive)
                }
                onClick={() => setExpanded(!expanded)}
                aria-expanded={expanded}
            />
            {feed !== 'All' && !expanded && (
                <div
                    className={
                        feedSelectorClass.feedActive +
                        ' inline-flex justify-between pl-md pr-sm my-sm mx-lg text-base truncate rounded-md'
                    }
                >
                    {feed}
                    <UilTimes
                        className="text-neutral-700 dark:text-neutralDark-150 cursor-pointer"
                        onClick={() => useAppDispatch(setFeedState('All'))}
                    />
                </div>
            )}
            <Collapse className="px-2" show={expanded}>
                <FeedSelector feedClickHandler={() => setExpanded(!expanded)} />
            </Collapse>
        </div>
    )
}

export default FeedSelector
