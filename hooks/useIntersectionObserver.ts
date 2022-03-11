import React, { useEffect } from 'react'

interface useInstersectionObserverProps {
    root?: React.RefObject<any>
    target: React.RefObject<any>
    onIntersect: () => any
    threshold?: number
    rootMargin?: string
    enabled: boolean
}

const useIntersectionObserver = ({
    root,
    target,
    onIntersect,
    threshold = 1.0,
    rootMargin = '0px',
    enabled = true,
}: useInstersectionObserverProps): void => {
    useEffect(() => {
        if (!enabled) {
            return
        }

        const observer = new IntersectionObserver(
            entries =>
                entries.forEach(entry => entry.isIntersecting && onIntersect()),
            {
                root: root && root.current,
                rootMargin,
                threshold,
            }
        )

        const el = target && target.current

        if (!el) {
            return
        }

        observer.observe(el)

        return () => {
            observer.unobserve(el)
        }
    }, [target.current, enabled])
}

export default useIntersectionObserver
