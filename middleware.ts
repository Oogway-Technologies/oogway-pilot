import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// import { upstashRest } from './lib/upstash/upstash'
import getIP from './utils/helpers/getIP'

/**
 * Temporarily house rateLimit type and function definitions here
 * until NextJS pushes patch for next/server imports outside of pages
 */
// export interface RateLimitContextBase {
//     id: string
//     limit: number
//     timeframe: number
//     count: CountFn
// }

// export interface RateLimitContext extends RateLimitContextBase {
//     request: NextRequest
//     headers: readonly [string | null, string | null, string | null]
//     onRateLimit: OnRateLimit
// }

// export type RateLimitHandler = (
//     request: NextRequest
// ) => Promise<RateLimitResult> | RateLimitResult

// export type RateLimitResult =
//     | (RateLimitContextBase & {
//           request?: NextRequest
//           headers?: RateLimitHeaders
//           onRateLimit?: OnRateLimit
//       })
//     | Response

// export type RateLimitHeaders =
//     | null
//     | string
//     | readonly [string | null, string | null, string | null]

// export type OnRateLimit = (
//     context: RateLimitContext
// ) => Response | Promise<Response>

// export type CountFn = (
//     context: RateLimitContext & { key: string }
// ) => Promise<number | Response>

// function getHeaders(nameOrHeaders?: RateLimitHeaders) {
//     nameOrHeaders = nameOrHeaders ?? 'RateLimit'
//     return !nameOrHeaders || typeof nameOrHeaders === 'string'
//         ? ([
//               `X-${nameOrHeaders}-Limit`,
//               `X-${nameOrHeaders}-Remaining`,
//               `X-${nameOrHeaders}-Reset`,
//           ] as const)
//         : nameOrHeaders
// }

// const rateLimited: OnRateLimit = ({ id }) => {
//     return new Response(
//         JSON.stringify({
//             error: { message: `API rate limit exceeded for ${id}` },
//         }),
//         {
//             status: 429,
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         }
//     )
// }

// async function rateLimit(context: RateLimitContext) {
//     const { headers, id, limit, timeframe, count, onRateLimit } = context

//     // Temporal logging
//     const start = Date.now()
//     // By removing the milliseconds our of the date and dividing by `timeframe`
//     // we now have a time that changes every `timeframe` seconds
//     const time = Math.floor(Date.now() / 1000 / timeframe)
//     const key = `${id}:${time}`
//     let countOrRes: number | Response

//     try {
//         countOrRes = await count({ ...context, key })
//     } catch (err) {
//         console.error('Rate limit `count` failed with:', err)
//         // If the count function fails we'll ignore rate limiting and
//         // return a successful response to avoid blocking the request
//         return new Response(null)
//     }

//     const h =
//         countOrRes instanceof Response ? countOrRes.headers : new Headers()
//     const remaining = countOrRes instanceof Response ? 0 : limit - countOrRes
//     const reset = (time + 1) * timeframe

//     // Temporal logging
//     const latency = Date.now() - start
//     h.set('x-upstash-latency', `${latency}`)

//     if (headers[0]) h.set(headers[0], `${limit}`)
//     if (headers[1]) h.set(headers[1], `${remaining < 0 ? 0 : remaining}`)
//     if (headers[2]) h.set(headers[2], `${reset}`)
//     if (countOrRes instanceof Response) return countOrRes
//     if (remaining < 0) {
//         const res = await onRateLimit(context)

//         // Concat the rate limiting headers
//         headers.concat('x-upstash-latency').forEach(key => {
//             if (key) {
//                 const value = h.get(key)
//                 if (value) res.headers.set(key, value)
//             }
//         })

//         return res
//     }
//     return new Response(null, { headers: h })
// }

// export const initRateLimit = (fn: RateLimitHandler) =>
//     async function isRateLimited(request: NextRequest) {
//         const ctx = await fn(request)

//         if (ctx instanceof Response) return ctx

//         return rateLimit({
//             ...ctx,
//             request: ctx.request ?? request,
//             headers: getHeaders(ctx.headers),
//             onRateLimit: ctx.onRateLimit ?? rateLimited,
//         })
//     }

// export default function getForwardedFor(req: Request) {
//     // Fetch forwarded for value and class type
//     let xff = req.headers.get('x-forwarded-for')
//     const xffClass = req.headers.get('x-forwarded-for-class')

//     // Ensure xffClass is specified
//     if (!xffClass) {
//         throw new Error('X-Forwarded-For-Class header is missing.')
//     }

//     // Set default xff for ip
//     xff = xff && xffClass === 'ip' ? xff.split(',')[0] : xff

//     return [xffClass, xff] as const
// }

// export const idRateLimit = initRateLimit(request => ({
//     id: `${getForwardedFor(request)[0]}:${getForwardedFor(request)[1]}`,
//     count: increment,
//     limit: 1, // # requests
//     timeframe: 1, // seconds
// }))

// const increment: CountFn = async ({ key, timeframe }) => {
//     const results = await upstashRest(
//         [
//             ['INCR', key],
//             ['EXPIRE', key, timeframe],
//         ],
//         { pipeline: true }
//     )
//     return results[0].result
// }

/**
 * Main Middleware Function
 */

export async function middleware(req: NextRequest) {
    // Can abstract to handle multiple routes and configs
    // if (req.nextUrl.pathname.startsWith('/api/ai/adviceBot')) {
    //     const res = await idRateLimit(req)
    //     // If the call fails, log the rate limiting response
    //     // and redirect user to referrer without encountering and error
    //     // If we intend to call API from other services, not just through
    //     // new post form, may want to account for those calls as well.
    //     if (res.status !== 200) {
    //         // Get referer page and redirect
    //         const referer = req.headers.get('referer')

    //         // if no referrer or not coming from new post form
    //         // return response
    //         if (!referer || !referer.includes('/?feed')) return res

    //         // Otherwise reroute the user to the feed
    //         return NextResponse.redirect(referer)
    //     }
    // }

    // Add IP addresses to cookies
    const response = NextResponse.next()
    // Set custom header
    response.cookies.set('userIp', getIP(req))
    // Return response
    return response
}
