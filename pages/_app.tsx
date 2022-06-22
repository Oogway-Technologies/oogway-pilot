// Styles and Componenets
import '../styles/globals.css'

import { UserProvider } from '@auth0/nextjs-auth0'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import Script from 'next/script'
import { ThemeProvider } from 'next-themes'
import { useState } from 'react'
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { Provider } from 'react-redux'

import Layout from '../components/Layout'
import store from '../features/store'

function MyApp({ Component, pageProps }: AppProps) {
    const [queryClient] = useState(() => new QueryClient())

    return (
        <>
            <Head>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, maximum-scale=1"
                />
            </Head>
            <Script
                strategy="lazyOnload"
                src={`https://www.googletagmanager.com/gtag/js?id=G-NGML1G074L`}
            />
            <Script id="google-analytics" strategy="lazyOnload">
                {`
                            window.dataLayer = window.dataLayer || [];
                            function gtag(){window.dataLayer.push(arguments);}
                            gtag('js', new Date());
                            gtag('config', 'G-NGML1G074L');
                        `}
            </Script>
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
        </>
    )
}

export default MyApp
