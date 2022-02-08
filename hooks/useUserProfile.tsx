import { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from '../firebase'
import { getRandomProfilePic, getRandomUsername } from '../lib/user'

const useUserProfile = (userUid: string) => {
    const [userProfile, setUserProfile] = useState({})

    useEffect(() => {
        db.collection('profiles')
            .doc(userUid)
            .get()
            .then((profile) => {
                if (profile.exists) {
                    // Update profile state
                    setUserProfile({
                        ...userProfile,
                        ...profile.data(),
                    })
                }
            })
            .catch(() => console.log('Error retrieving user profile'))
    }, [])

    return [userProfile, setUserProfile] as const
}

export default useUserProfile
