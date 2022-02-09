import { useRecoilState } from 'recoil'

export async function middleware(req) {
    const [userProfile, setUserProfile] = useRecoilState(isPlayingState)
    const { pathname } = req.nextUrl

    // On pathname
    if (pathname.includes('/api/auth/callback')) {
        // Here I would fetch user profile and setup a recoil atom
        // to get that state on all components...
        return NextResponse.next()
    }
}
