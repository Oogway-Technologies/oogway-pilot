import {useEffect} from 'react';
import '../styles/globals.css';
import Layout from '../components/Layout';
import { ThemeProvider } from 'next-themes';
import  type { AppProps} from 'next/app';
import { RecoilRoot } from 'recoil';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { createUser, createUserProfile } from '../lib/db';
import { formatUser, getRandomUsername, getRandomProfilePic } from '../lib/user';
import Login from "./login";
import Loading from "../components/Loading";

function MyApp({ Component, pageProps }: AppProps) {
  // Read in config variables from environment
  const appConfig = {
    isDevelopment: process.env.NEXT_PUBLIC_DEV
  }

  // Set up state
  const [user, loading] = useAuthState(auth);

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

          // Add default user profile
          const defaultProfile = {
            username: getRandomUsername(),
            name: "",
            lastName: "",
            profilePic: getRandomProfilePic(),
            bio: "",
            location: "",
            allowDM: false,
            resetProfile: true,
            uid: userWithoutToken.uid,
          }
          createUserProfile(userFormatted.uid, defaultProfile)
        })
      }
  }, [user]);


  // Only add login for production builds
  if (!appConfig.isDevelopment) {
    // If the authentication is loading (e.g., check token validity),
    // return the loading screen
    if (loading) return <Loading />
  }  

  // If the user is not logged-in, re-route to the Login page
  if (!user) return <Login />

  return (
    <ThemeProvider attribute='class' enableSystem={true}>
        <Layout>
          <RecoilRoot>
            <Component {...pageProps} />
          </RecoilRoot>
        </Layout>
    </ThemeProvider>
  )
}

export default MyApp
