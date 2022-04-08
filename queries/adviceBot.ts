import { useMutation } from 'react-query'

import { signJwt } from '../lib/jwt'
import API from '../services/axios'
import { FirebasePost } from '../utils/types/firebase'

/**
 * Creation hooks
 */

type AdviceBotPayload = {
    post: FirebasePost
    id: string
}

export const createAdviceBotComment = async (
    adviceBotPayload: AdviceBotPayload
) => {
    const { post, id } = adviceBotPayload
    // Sign token
    const token = signJwt({ botId: id })
    const headers = {
        authorization: `Bearer ${token}`,
    }
    return API.post('adviceBot', post, {
        headers: headers,
    })
}

export const useCreateAdviceBotComment = () =>
    // postId: string
    {
        // Not neccesarry since comments calls are not yet handled with react query
        // const queryClient = useQueryClient()

        return useMutation(
            (adviceBotPayload: AdviceBotPayload) =>
                createAdviceBotComment(adviceBotPayload),
            {
                retry: 3, // Attempt to send request 3 times if fail (with exponential back off)
                // Not necessary atm since comments are handled via firebase query snapshot
                // not react query
                // onSuccess: () => {
                //     // Invalidate the post's comments so they refresh
                // }
            }
        )
    }
