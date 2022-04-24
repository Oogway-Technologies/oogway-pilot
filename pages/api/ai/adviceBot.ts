import {
    addDoc,
    collection,
    doc,
    getDoc,
    serverTimestamp,
} from 'firebase/firestore'
import { JwtPayload } from 'jsonwebtoken'
import { NextApiRequest, NextApiResponse } from 'next'

import { BingSearchAPI, OogwayDecisionAPI } from '../../../axios'
import { db } from '../../../firebase'
import { checkReq, verifyJwt } from '../../../lib/jwt/jwt'
import { adviceBotId, bingTopN } from '../../../utils/constants/global'
import { BingReference } from '../../../utils/types/bingapi'
import {
    AIBotComment,
    FirebaseEngagement,
    FirebasePost,
} from '../../../utils/types/firebase'
import { OpenAPICall } from '../../../utils/types/openapi'

interface ExtendedNextApiRequest extends NextApiRequest {
    body: FirebasePost
}

async function handlePost(req: ExtendedNextApiRequest, res: NextApiResponse) {
    // Check authentication
    const [message, token] = checkReq(req)
    if (message) return res.status(500).json({ message })

    // verify token
    if (token) {
        verifyJwt(token, (err, decoded) => {
            if (err) return res.status(401).send(err)
            const { botId } = <JwtPayload>decoded
            if (botId !== adviceBotId)
                return res
                    .status(401)
                    .send('Client unauthorized to make this call.')
        })
    } else {
        return res
            .status(401)
            .json({ err: 'Client unauthorized to make this call.' })
    }

    try {
        const { body } = req

        // Create OpenAI Completion inputt
        const post: FirebasePost = {
            ...body,
            timestamp: serverTimestamp(),
        }

        // Send post info to Bing API
        const params = {
            q: post.message + ' site:reddit.com',
            mkt: 'en-US',
        }
        const bingResponse = await BingSearchAPI.get('/', { params: params })
        const bingData = bingResponse.data

        // Get array of top N results
        const references = bingData
            ? (bingData.webPages.value.slice(0, bingTopN) as BingReference[])
            : null

        // Send post info to Oogway Decision endpoint
        const decisionData = {
            question: post.message,
            context: post.description, // Does this need to be truncated
            token: process.env.OOGWAY_DECISION_TOKEN,
        }
        const decisionResponse = await OogwayDecisionAPI.post(
            'oogway_decision',
            decisionData
        )
        const responseData = decisionResponse.data

        if (decisionResponse.status !== 200) {
            throw new Error(
                `Oogway Decision API failed with (${res.status}): ${
                    typeof responseData === 'string'
                        ? responseData
                        : JSON.stringify(responseData, null, 2)
                }`
            )
        }

        // Extract advice bot message and filter status
        const adviceBotMessage = responseData['decision']
        const filterStatus = responseData['label']

        // Log activity to 'advice-bot-calls' collection
        const adviceBotCall: OpenAPICall = {
            postId: post.id,
            postMessage: post.message,
            postDescription: post.description,
            authorId: post.uid,
            feed: post.feed,
            completionPrompt: responseData.prompt,
            completionHyperparams: responseData.gpt3_params,
            completionResponse: adviceBotMessage,
            filterPrompt: responseData.filter_prompt,
            filterResponse: filterStatus,
            filterLogprobs: responseData.probs,
            timestamp: serverTimestamp(),
        }
        await addDoc(collection(db, 'advice-bot-calls'), adviceBotCall)

        // Create advice bot comment
        const adviceBotProfile = await getDoc(doc(db, 'profiles', adviceBotId))
        const sensitiveDataMessage =
            'Sorry, our AI does not have any advice for you. Our decision coaches can help you with this decision.'
        const adviceBotComment: AIBotComment = {
            postId: post.id,
            parentId: null,
            isComment: true,
            timestamp: serverTimestamp(),
            message:
                filterStatus === '2' ? sensitiveDataMessage : adviceBotMessage,
            references: references,
            author: adviceBotProfile?.data()?.name || 'Oogway AI Bot',
            authorUid: adviceBotId,
            likes: {},
            dislikes: {},
            filterStatus: filterStatus,
        }
        const docRef = await addDoc(
            collection(db, `post-activity`),
            adviceBotComment
        )
        if (!docRef) {
            return res
                .status(403)
                .json({ err: 'Failed to create advice bot comment' })
        }

        // Add notification for user
        const engagemment: FirebaseEngagement = {
            engagerId: adviceBotId,
            engageeId: post.uid,
            action: 'comment',
            targetId: docRef.id,
            targetObject: 'Post',
            targetRoute: `comments/${post.id}`,
            isNew: true,
            timestamp: serverTimestamp(),
        }
        await addDoc(collection(db, 'engagement-activity'), engagemment)

        // Return successful comment
        return res.status(201).json(adviceBotComment)
    } catch (err) {
        return res.status(500).json({ err: err })
    }
}

export default async function adviceBotHandler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { method } = req

    // Perform request
    if (method === 'POST') {
        await handlePost(req, res)
    } else {
        res.setHeader('Allow', ['POST'])
        res.status(405).end(`Method ${method} Not Allowed.`)
    }
}
