// Styles and Componenets
import '../styles/globals.css'

// Auth0 Authenticaiton
import { UserProvider } from '@auth0/nextjs-auth0'
import type { AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes'
import { useState } from 'react'
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query'
// Query Management
import { ReactQueryDevtools } from 'react-query/devtools'
import { Provider } from 'react-redux'

import Layout from '../components/Layout'
import store from '../features/store'

function MyApp({ Component, pageProps }: AppProps) {
    const [queryClient] = useState(() => new QueryClient())

    return (
        <QueryClientProvider client={queryClient}>
            <Hydrate state={pageProps.dehydratedState}>
                <ThemeProvider attribute="class" enableSystem={true}>
                    <Provider store={store}>
                        <UserProvider>
                            <Layout>
                                <Component {...pageProps} />
                            </Layout>
                        </UserProvider>
                    </Provider>
                </ThemeProvider>
                <ReactQueryDevtools initialIsOpen={true} />
            </Hydrate>
        </QueryClientProvider>
    )
}

export default MyApp
