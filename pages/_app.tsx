import '../styles/globals.css'
import Layout from '../components/Layout'
import { ThemeProvider } from 'next-themes'
import  type { AppProps} from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {

  return (
    <ThemeProvider attribute='class' enableSystem={true}>
        <Layout >
            <Component {...pageProps} />
        </Layout>
    </ThemeProvider>
      
  )
}

export default MyApp
