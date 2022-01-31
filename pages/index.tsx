import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";

export default function Home() {
  const [user] = useAuthState(auth);
  const router = useRouter();

  const forwardToFeed = () => {
    router.push(`/feed/${user.uid}`);
    return null;
  }

  return (
    <div>
      {forwardToFeed()}
    </div>
  )
}
