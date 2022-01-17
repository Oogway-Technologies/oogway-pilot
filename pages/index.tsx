import Head from 'next/head';
import Header from '../components/Header';
import { useTheme } from 'next-themes';

export default function Home() {
    const {theme, setTheme} = useTheme()

    return (
    <div className="">
      <Head>
        <title>Oogway</title>
      </Head>
    
    </div>
  )
}
