import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuth } from "react-oidc-context";

const signOutRedirect = () => {
  const clientId = "1cusrvvn01cc7dq61lk8g7mr1a";
  const logoutUri = "http://localhost:3000";
  const cognitoDomain = "https://login.larus.fr";
  window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(
    logoutUri
  )}`;
};

export default function Page() {
  const router = useRouter();
  const auth = useAuth();
  useEffect(() => {
    if (auth.isAuthenticated) {
      router.push("choosePlayer");
    }
  }, [auth.isAuthenticated, router]);
  return (
    <div>
      <button onClick={() => auth.signinRedirect()}>Sign in</button>
      <h1>Hello, Next.js!</h1>
      <Link href="/game">Go</Link>
    </div>
  );
}
