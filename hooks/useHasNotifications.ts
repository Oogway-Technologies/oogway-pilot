import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'

import { db } from '../services/firebase'

export const useHasNotifications = (userId: string) => {
    // Track status of notifications
    const [hasNewNotifications, setHasNewNotifications] =
        useState<boolean>(false)

    // Use useEffect to make a realtime listener to
    // firebase to detect whether there are new notifications
    useEffect(() => {
        // Write query
        const constraints = [
            where('engageeId', '==', userId),
            where('isNew', '==', true),
        ]
        const q = query(collection(db, 'engagement-activity'), ...constraints)

        const unsubscribe = onSnapshot(
            q,
            querySnapshot => {
                // Set new notifications to true
                // if the snapshot detects new engagement-activity
                // for the user
                setHasNewNotifications(querySnapshot.size > 0)
            },
            err => {
                console.log(err)
            }
        )

        return unsubscribe
    }, [userId])

    return [hasNewNotifications, setHasNewNotifications] as const
}
