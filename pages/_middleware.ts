import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import getIP from '../utils/helpers/getIP'

export function middleware(req: NextRequest) {
    const response = NextResponse.next()
    // Set custom header
    response.cookie('userIp', getIP(req))
    // Return response
    return response
}
