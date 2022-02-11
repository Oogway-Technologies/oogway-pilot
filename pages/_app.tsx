import '../styles/globals.css'
import Layout from '../components/Layout'
import {ThemeProvider} from 'next-themes'
import type {AppProps} from 'next/app'
import {RecoilRoot} from 'recoil'


// Auth0
import {UserProvider} from '@auth0/nextjs-auth0';

function MyApp({Component, pageProps}: AppProps) {
    // Read in config variables from environment
    const appConfig = {
        isDevelopment: process.env.NEXT_PUBLIC_DEV,
    }

    return (
        <ThemeProvider attribute="class" enableSystem={true}>
            <RecoilRoot>
                <UserProvider>
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </UserProvider>
            </RecoilRoot>
        </ThemeProvider>
    )
}

export default MyApp
