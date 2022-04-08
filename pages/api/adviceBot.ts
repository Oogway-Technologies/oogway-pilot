import {
    addDoc,
    collection,
    doc,
    getDoc,
    serverTimestamp,
} from 'firebase/firestore'
import { JwtPayload } from 'jsonwebtoken'
import { NextApiRequest, NextApiResponse } from 'next'

import { checkReq, verifyJwt } from '../../lib/jwt'
import { db } from '../../services/firebase'
import OpenAI, { completionParams, filterParams } from '../../services/openai'
import { adviceBotId } from '../../utils/constants/global'
import {
    FirebaseComment,
    FirebaseEngagement,
    FirebasePost,
} from '../../utils/types/firebase'
import { OpenAPICall } from '../../utils/types/openapi'

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

    // try {
    const { body } = req

    // Create OpenAI Completion inputt
    const post: FirebasePost = {
        ...body,
        timestamp: serverTimestamp(),
    }

    // Prepare completion prompt and send to openAI coompletion
    const completionPrompt = completionParams.template(
        post.message,
        post.description.substring(0, 1000 - post.message.length)
    )
    const completionResponse = await OpenAI.createCompletion(
        completionParams.engine, // how to handle env vars potentiall uundefined
        {
            prompt: completionParams.preprompt + completionPrompt,
            ...completionParams.hyperparams,
        }
    )
    console.log('Completion response: ', completionResponse)

    // Retrieve response
    const completionChoices = completionResponse.data.choices
    console.log('Completion choices: ', completionChoices)
    if (!completionChoices || (completionChoices && !completionChoices[0])) {
        return res
            .status(403)
            .json({ err: 'Call to OpenAPI Completion endpoint failed.' })
    }
    const adviceBotMessage = completionChoices[0].text as string

    console.log('Advice bot messaage: ', adviceBotMessage)

    // Pass coomment through content filter
    const filterPrompt = filterParams.template(adviceBotMessage)
    const filterResponse = await OpenAI.createCompletion(filterParams.engine, {
        prompt: filterPrompt,
        ...filterParams.hyperparams,
    })
    console.log('Filter response: ', filterResponse)

    // Retrieve filter status code and log probs
    const filterChoices = filterResponse.data.choices
    if (!filterChoices || (filterChoices && !filterChoices[0])) {
        return res
            .status(403)
            .json({ err: 'Call to OpenAPI Completion endpoint failed.' })
    }
    const filterStatus = filterChoices[0].text as '0' | '1' | '2'
    const filterLogprobs = filterChoices[0].logprobs
        ?.top_logprobs as Array<object>

    console.log('Filter status: ', filterStatus)
    console.log('Filter logprobs: ', filterLogprobs)

    // Log activity to 'advice-bot-calls' collection
    const adviceBotCall: OpenAPICall = {
        postId: post.id,
        postMessage: post.message,
        postDescription: post.description,
        authorId: post.uid,
        feed: post.feed,
        completionEngine: completionParams.engine,
        completionPrompt: completionPrompt,
        completionHyperparams: completionParams.hyperparams,
        completionResponse: adviceBotMessage,
        filterEngine: filterParams.engine,
        filterPrompt: filterPrompt,
        filterHyperparams: filterParams.hyperparams,
        filterResponse: filterStatus,
        filterLogprobs: filterLogprobs[0],
        timestamp: serverTimestamp(),
    }
    await addDoc(collection(db, 'advice-bot-calls'), adviceBotCall)

    // Create advice bot comment
    const adviceBotProfile = await getDoc(doc(db, 'profiles', adviceBotId))
    const sensitiveDataMessage =
        'Sorry, our AI does not have any advice for you. Our decision coaches can help you with this decision.'
    const adviceBotComment: FirebaseComment = {
        postId: post.id,
        parentId: null,
        isComment: true,
        timestamp: serverTimestamp(),
        message:
            filterStatus === '2' || !filterStatus
                ? sensitiveDataMessage
                : adviceBotMessage,
        author: adviceBotProfile?.data.name || 'Oogway AI Bot',
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
    // } catch (err) {
    //     return res.status(403).json({ err: 'Error!' })
    // }
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
