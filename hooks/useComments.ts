import { useEffect, useState } from 'react'
import { streamCommentsCollection } from '../lib/commentsHelper'


export const useComments = (id: string | string[] | undefined) => {
    if (!id) {
        return
    }
    // track comments in
    const [commentsSnapshot, setCommentsSnapshot] = useState()

    // Use useEffect to bind on document loading the
    // function that will store comments and update on
    // each change of the DB (triggered by onSnapshot)
    useEffect(() => {
        const unsubscribe = streamCommentsCollection(
            id,
            (querySnapshot) => {
                // Fetch comments
                setCommentsSnapshot(querySnapshot.docs)
            },
            (error) => {console.log(error)}
        )
        return unsubscribe;
    }, [id, setCommentsSnapshot])

    return [commentsSnapshot, setCommentsSnapshot] as const
}