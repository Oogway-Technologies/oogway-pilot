import { NextRequest } from 'next/server'

import { idRateLimit } from '../../../lib/upstash/id-rate-limit'

export async function middleware(req: NextRequest) {
    // Can abstract to handle multiple routes and configs
    if (req.nextUrl.pathname === '/api/adviceBot') {
        const res = await idRateLimit(req)
        if (res.status !== 200) return res

        console.log('Middleware initiated!')
        console.log('Response Headers', res.headers, '\n\n')
        res.headers.set('content-type', 'application/json')

        return new Response(JSON.stringify({ done: true }), {
            status: 200,
            headers: res.headers,
        })
    }
    return req
}
