import { NextRequest, NextResponse } from 'next/server'

import { idRateLimit } from '../../../lib/upstash/idRateLimit'

export async function middleware(req: NextRequest) {
    // Can abstract to handle multiple routes and configs
    if (req.nextUrl.pathname === '/api/ai/adviceBot') {
        const res = await idRateLimit(req)
        // If the call fails, log the rate limiting response
        // and redirect user to referrer without encountering and error
        // If we intend to call API from other services, not just through
        // new post form, may want to account for those calls as well.
        if (res.status !== 200) {
            // Get referer page and redirect
            const referer = req.headers.get('referer')

            // if no referrer or not coming from new post form
            // return response
            if (!referer || !referer.includes('/?feed')) return res

            // Otherwise reroute the user to the feed
            return NextResponse.rewrite(referer)
        }
        return NextResponse.next()
    }
    return req
}
