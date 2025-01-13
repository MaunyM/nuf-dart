import { Joueur, JoueurCricket } from "@/app/Type/Game";
import { GetServerSideProps } from "next";
import Link from 'next/link'
import { useAuth } from "react-oidc-context";


export default function Page() {
  const auth = useAuth();
    return <div>
      <button onClick={() => auth.signinRedirect()}>Sign in</button>
        <h1>Hello, Next.js!</h1>
        <Link href="/game">Go</Link>
        </div>
  }