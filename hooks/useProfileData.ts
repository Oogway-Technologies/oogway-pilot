import React, { useEffect, useState } from 'react'
import { streamProfileData } from '../lib/profileHelper'


export const useProfileData = (id: string | undefined) => {
    // Track profile data
    const [profileData, setProfileData] = useState({})

    // Use useEffect to start streaming profile data
    // on component mound and store it in state.
    // Any changes in the DB will trigger an update due
    // to on snapshot
    useEffect(() => {
        const unsubscribe = streamProfileData(
            id,
            (snapshot) => {
                if (snapshot.exists()) {
                    setProfileData({
                        ...snapshot.data()
                    })
                }
            },
            (error) => {console.log(error)}
        )
        return () => {
            setProfileData({})
            unsubscribe
        }

    }, [id])

    return [profileData, setProfileData] as const
}
