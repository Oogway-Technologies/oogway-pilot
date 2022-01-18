import {useEffect} from 'react';
import '../styles/globals.css'
import Layout from '../components/Layout'
import { ThemeProvider } from 'next-themes'
import  type { AppProps} from 'next/app'

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { createUser } from '../lib/db';
import Login from "./login"
import Loading from "../components/Loading"



function MyApp({ Component, pageProps }: AppProps) {
  // Read in config variables from environment
  const appConfig = {
    isDevelopment: process.env.NEXT_PUBLIC_DEV
  }

  // Only add login for production builds
  if (!appConfig.isDevelopment) {
    // Set up state
    const [user, loading] = useAuthState(auth);

    
    // Utility function for setting up a user
    const formatUser = async (user) => {
        const decodedToken = await user.getIdTokenResult(/*forceRefresh*/ true);
        const { token, expirationTime } = decodedToken;
    
        // console.log(token);
        return {
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        provider: user.providerData[0].providerId,
        photoUrl: user.photoURL,
        token,
        expirationTime,
        // stripeRole: await getStripeRole(),
        };
    };
        
    // Run the first time the component is mounted
    useEffect(() => {
        if (user) {
        // Format the user to store it into the DB
        (async () => await formatUser(user))()
        .then((userFormatted) => {

            // Extract everything but and discard the token
            const { token, ...userWithoutToken } = userFormatted;

            // Push the user to the DB
            createUser(userFormatted.uid, userWithoutToken);
        })
        }
    }, [user]);
  
    // If the authentication is loading (e.g., check token validity),
    // return the loading screen
    if (loading) return <Loading />

    // If the user is not logged-in, re-route to the Login page
    if (!user) return <Login />
  }
  
  return (
    <ThemeProvider attribute='class' enableSystem={true}>
        <Layout >
            <Component {...pageProps} />
        </Layout>
    </ThemeProvider>
      
  )
}

export default MyApp
