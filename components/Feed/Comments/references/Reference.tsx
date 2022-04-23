import Link from 'next/link'
import React, { FC } from 'react'

import { bodyXSmall } from '../../../../styles/typography'
import { BingReference } from '../../../../utils/types/bingapi'
import { ReferenceBlockStyles } from './ReferencesSyles'

type Props = {
    reference: BingReference
}

const Reference: FC<
    React.PropsWithChildren<React.PropsWithChildren<Props>>
> = ({ reference }) => {
    const parseRefName = (name: string): string => {
        // Reddit names often have the sub-reddit in the title after
        // a colon. If there, only return everything before.
        return name.split(':')[0].trim()
    }

    const parseSubreddit = (url: string): string | null => {
        const pattern = new RegExp('(?<=/r/).+?(?=/)')
        const match = url.match(pattern)
        // if there's a subreddit, return. Otherwise null
        return match ? match[0] : null
    }

    return (
        <Link href={reference.url} passHref={true}>
            <a target="_blank" rel="noopener noreferrer">
                <div className={ReferenceBlockStyles.body}>
                    <span className={ReferenceBlockStyles.name + bodyXSmall}>
                        {parseRefName(reference.name)}
                    </span>
                    {parseSubreddit(reference.url) && (
                        <span
                            className={ReferenceBlockStyles.slug + bodyXSmall}
                        >
                            {'Reddit > r/'}
                            {parseSubreddit(reference.url)}
                        </span>
                    )}
                </div>
            </a>
        </Link>
    )
}

export default Reference
