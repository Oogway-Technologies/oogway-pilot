import {useEffect, useState} from 'react'
import {streamProfileData} from '../lib/profileHelper'
import { FirebaseProfile } from '../utils/types/firebase'


export const useProfileData = (id: string) => {
    // Track profile data
    const [profileData, setProfileData] = useState<FirebaseProfile>()

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
            (error) => {
                console.log(error)
            }
        )
        return () => {
            unsubscribe()
        }

    }, [id])

    return [profileData, setProfileData] as const
}
