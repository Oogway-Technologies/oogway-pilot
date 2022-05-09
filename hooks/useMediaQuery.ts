import { useEffect, useState } from 'react'

function useMediaQuery(query: string): boolean {
    const getMatches = (window: any, query: string): boolean => {
        // Prevents SSR issues
        if (typeof window !== 'undefined') {
            return window.matchMedia(query).matches
        }
        return false
    }

    const [matches, setMatches] = useState<boolean>(false)

    useEffect(() => {
        const matchMedia = window.matchMedia(query)
        // Triggered at the first client-side load and if query changes
        setMatches(getMatches(window, query))

        // Listen matchMedia
        matchMedia.addEventListener('change', () => {
            setMatches(getMatches(window, query))
        })

        return () => {
            matchMedia.removeEventListener('change', () => {
                setMatches(getMatches(window, query))
            })
        }
    }, [query])

    return matches
}

export default useMediaQuery
