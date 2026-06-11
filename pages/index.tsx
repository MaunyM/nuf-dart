import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuth } from "react-oidc-context";



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
      {router.query.sessionExpired && (
        <p>Votre session a expiré, veuillez vous reconnecter.</p>
      )}
      <button onClick={() => auth.signinRedirect()}>Sign in</button>
      <h1>Hello, Next.js!</h1>
      <Link href="/game">Go</Link>
    </div>
  );
}
