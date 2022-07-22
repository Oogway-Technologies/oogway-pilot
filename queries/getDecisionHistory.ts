import { collection, getDocs, query, where } from 'firebase/firestore'

import { db } from '../firebase'
import { DecisionFirebase } from '../utils/types/firebase'

export const getDecisionHistory = async (uid: string) => {
    const decisionActivityRef = query(
        collection(db, 'decision-activity'),
        where('userId', '==', uid)
    )
    const decisionActivity = await getDocs(decisionActivityRef)
    const complete: DecisionFirebase[] = []
    const inComplete: DecisionFirebase[] = []

    decisionActivity.forEach(doc => {
        const decisionActivityItem = doc.data() as DecisionFirebase
        if (decisionActivityItem.isComplete && decisionActivityItem?.question) {
            complete.push(decisionActivityItem)
        }
        if (
            !decisionActivityItem.isComplete &&
            decisionActivityItem?.question
        ) {
            inComplete.push(decisionActivityItem)
        }
    })

    return { complete, inComplete }
}
