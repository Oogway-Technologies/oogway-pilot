import { useEffect } from 'react'
import '../styles/globals.css'
import Layout from '../components/Layout'
import { ThemeProvider } from 'next-themes'
import type { AppProps } from 'next/app'
import { RecoilRoot } from 'recoil'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../firebase'
import { createUser } from '../lib/db'
import { formatUser } from '../lib/user'
import Login from './login'
import Loading from '../components/Loading'

// Auth0
import { UserProvider } from '@auth0/nextjs-auth0';

function MyApp({ Component, pageProps }: AppProps) {
    // Read in config variables from environment
    const appConfig = {
        isDevelopment: process.env.NEXT_PUBLIC_DEV,
    }

    // Set up user state
    const [user, loading] = useAuthState(auth)

    // Run the first time the component is mounted
    useEffect(() => {
        if (user) {
            // Format the user to store it into the DB
            ;(async () => await formatUser(user))().then((userFormatted) => {
                // Extract everything but and discard the token
                const { token, ...userWithoutToken } = userFormatted

                // Push the user to the DB
                createUser(userFormatted.uid, userWithoutToken)
            })
        }
    }, [user])

    const AuthState = () => {
        if (loading) return <Loading />
        else if (!user) return <Login />
        else
            return (
                <UserProvider>
                    <Layout>
                        <RecoilRoot>
                            <Component {...pageProps} />
                        </RecoilRoot>
                    </Layout>
                </UserProvider>
            )
    }

    return (
        <ThemeProvider attribute="class" enableSystem={true}>
            <UserProvider>
                <Layout>
                    <RecoilRoot>
                        <Component {...pageProps} />
                    </RecoilRoot>
                </Layout>
            </UserProvider>
        </ThemeProvider>
    )
}

export default MyApp
