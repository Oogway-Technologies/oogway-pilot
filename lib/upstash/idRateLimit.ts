import { CountFn, initRateLimit } from './rateLimit'
import { upstashRest } from './upstash'

export default function getForwardedFor(req: Request) {
    // Fetch forwarded for value and class type
    let xff = req.headers.get('x-forwarded-for')
    const xffClass = req.headers.get('x-forwarded-for-class')

    // Ensure xffClass is specified
    if (!xffClass) {
        throw new Error('X-Forwarded-For-Class header is missing.')
    }

    // Set default xff for ip
    xff = xff && xffClass === 'ip' ? xff.split(',')[0] : xff

    return [xffClass, xff] as const
}

export const idRateLimit = initRateLimit(request => ({
    id: `${getForwardedFor(request)[0]}:${getForwardedFor(request)[1]}`,
    count: increment,
    limit: 1, // # requests
    timeframe: 1, // seconds
}))

const increment: CountFn = async ({ key, timeframe }) => {
    const results = await upstashRest(
        [
            ['INCR', key],
            ['EXPIRE', key, timeframe],
        ],
        { pipeline: true }
    )
    return results[0].result
}
