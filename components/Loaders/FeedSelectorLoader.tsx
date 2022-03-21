import React, { useEffect, useState } from 'react'
import ContentLoader from 'react-content-loader'

import useWindowDimensions from '../../hooks/useWindowDimensions'

export const FeedSelectorLoader = (props: any) => {
    const [loaderWidth, setLoaderWidth] = useState(100)
    const { scnWidth } = useWindowDimensions()

    const calculateWidth = (w: number | undefined) => {
        if (w) {
            if (w > 1440) return 220
            else if (w > 1220) return 200
            else if (w > 1100) return 175
            else if (w > 960) return 150
            else if (w > 768) return 125
            else if (w > 640) return 100
        }

        return null
    }

    useEffect(() => {
        if (scnWidth) setLoaderWidth(calculateWidth(scnWidth) || 100)
    }, [scnWidth])

    return (
        <ContentLoader
            speed={2}
            width={loaderWidth}
            height={150}
            viewBox="0 0 250 150"
            backgroundColor="#B0B3B8"
            foregroundColor="#7269FF"
            {...props}
        >
            <rect x="25" y="5" rx="5" ry="5" width="220" height="10" />
            <rect x="25" y="35" rx="5" ry="5" width="220" height="10" />
            <rect x="25" y="65" rx="5" ry="5" width="220" height="10" />
            <rect x="25" y="95" rx="5" ry="5" width="220" height="10" />
            <rect x="25" y="125" rx="5" ry="5" width="220" height="10" />
        </ContentLoader>
    )
}
