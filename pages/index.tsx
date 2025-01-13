import { usePlayers } from "@/app/service/gameService";
import { Joueur, JoueurCricket } from "@/app/Type/Game";
import { GetServerSideProps } from "next";
import Link from 'next/link'
import { useAuth } from "react-oidc-context";

const signOutRedirect = () => {
  const clientId = "1cusrvvn01cc7dq61lk8g7mr1a";
  const logoutUri = "http://localhost:3000";
  const cognitoDomain = "https://login.larus.fr";
  window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
};


export default function Page() {
  const auth = useAuth();
  const { players, isLoading } = usePlayers()
  if (auth.isAuthenticated) {
    return (
      <div>
        {players && players[0].id}
        <pre> Hello: {auth.user?.profile.email} </pre>
        <pre> ID Token: {auth.user?.id_token} </pre>
        <pre> Access Token: {auth.user?.access_token} </pre>
        <pre> Refresh Token: {auth.user?.refresh_token} </pre>

        <button onClick={() => auth.removeUser()}>Sign out</button>
      </div>
    );
  }
    return <div>
      <button onClick={() => auth.signinRedirect()}>Sign in</button>
        <h1>Hello, Next.js!</h1>
        <Link href="/game">Go</Link>
        </div>
  }