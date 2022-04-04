// Next
// Styles and Componenets
import '../styles/globals.css'

// Auth0 Authenticaiton
import { UserProvider } from '@auth0/nextjs-auth0'
import type { AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes'
import { useEffect, useState } from 'react'
import { hotjar } from 'react-hotjar'
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query'
// Query Management
import { ReactQueryDevtools } from 'react-query/devtools'
// Recoil
import { RecoilRoot } from 'recoil'

import Layout from '../components/Layout'

function MyApp({ Component, pageProps }: AppProps) {
    const [queryClient] = useState(() => new QueryClient())

    useEffect(() => {
        hotjar.initialize(
            Number(process.env.HOTJAR_ID) || 0,
            Number(process.env.HOTJAR_SV) || 0
        )
    }, [])

    return (
        <QueryClientProvider client={queryClient}>
            <Hydrate state={pageProps.dehydratedState}>
                <ThemeProvider attribute="class" enableSystem={true}>
                    <RecoilRoot>
                        <UserProvider>
                            <Layout>
                                <Component {...pageProps} />
                            </Layout>
                        </UserProvider>
                    </RecoilRoot>
                </ThemeProvider>
                <ReactQueryDevtools initialIsOpen={true} />
            </Hydrate>
        </QueryClientProvider>
    )
}

export default MyApp
