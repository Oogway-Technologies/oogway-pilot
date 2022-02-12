import { useEffect, useState } from 'react'
import { getLikes } from '../lib/getLikesHelper'


export const usePostNumberLikes = (id: string) => {
    // Track number of likes
    const [numLikes, setNumLikes] = useState(0)

    // Use useEffect to bind on document loading the
    // function that will set the number of likes on
    // each change of the DB (triggered by onSnapshot)
    useEffect(() => {
        getLikes(id, setNumLikes)
        return () => {
            setNumLikes(0)
        }
    }, [id])

    return [numLikes, setNumLikes] as const
}