import { useEffect, useState } from 'react'

export default function useWindowDimensions() {
    const hasWindow = typeof window !== 'undefined'

    function getWindowDimensions() {
        const scnWidth = hasWindow ? window.innerWidth : null
        const scnHeight = hasWindow ? window.innerHeight : null
        return {
            scnWidth,
            scnHeight,
        }
    }

    function handleResize() {
        setWindowDimensions(getWindowDimensions())
    }

    const [windowDimensions, setWindowDimensions] = useState(
        getWindowDimensions()
    )

    useEffect(() => {
        if (hasWindow) {
            window.addEventListener('resize', handleResize)
            return () => window.removeEventListener('resize', handleResize)
        } else {
            return
        }
    }, [hasWindow])

    return windowDimensions
}
