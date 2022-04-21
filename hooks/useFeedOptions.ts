import { useEffect, useState } from 'react'

import { useFeedsQuery } from '../queries/feeds'
import { staticFeedOptions } from '../utils/types/params'

export const useFeedOptions = () => {
    // Track feed categories
    const { data: feedCategories, status } = useFeedsQuery()
    const [feedOptions, setFeedOptions] = useState<Array<staticFeedOptions>>([])

    // Track feed options in react-select schema
    useEffect(() => {
        if (status !== ('error' || 'loading') && feedCategories?.feeds) {
            const feedOptionsList: staticFeedOptions[] = []
            feedCategories?.feeds.forEach(elem => {
                if (elem.label === 'General') {
                    feedOptionsList.unshift({
                        value: elem.label,
                        label: elem.label,
                    })
                } else {
                    feedOptionsList.push({
                        value: elem.label,
                        label: elem.label,
                    })
                }
            })
            setFeedOptions(feedOptionsList)
        }
    }, [feedCategories])

    return [feedOptions, setFeedOptions] as const
}
