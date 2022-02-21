// Next
import { ThemeProvider } from 'next-themes'
import type { AppProps } from 'next/app'

// Recoil
import { RecoilRoot } from 'recoil'

// Auth0 Authenticaiton
import { UserProvider } from '@auth0/nextjs-auth0'

// Styles and Componenets
import '../styles/globals.css'
import Layout from '../components/Layout'

// Query Management
import { ReactQueryDevtools } from 'react-query/devtools'
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query'
import { useState } from 'react'

function MyApp({ Component, pageProps }: AppProps) {
    const [queryClient] = useState(() => new QueryClient())

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
