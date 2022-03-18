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
            setFeedOptions(
                feedCategories?.feeds.map(elem => ({
                    value: elem.label,
                    label: elem.label,
                }))
            )
        }
    }, [feedCategories])

    return [feedOptions, setFeedOptions] as const
}
