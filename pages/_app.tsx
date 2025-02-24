import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { AuthProvider } from "react-oidc-context";
import {
  Joueur,
} from "@/app/Type/Game";
import { useState } from "react";

const cognitoAuthConfig = {
  authority: "https://cognito-idp.eu-west-3.amazonaws.com/eu-west-3_hdaUJXlME",
  client_id: "1cusrvvn01cc7dq61lk8g7mr1a",
  redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI,
  response_type: "code",
  lang: "fr",
  scope: "aws.cognito.signin.user.admin email openid profile",
};

const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {

  const [players, setPlayers] = useState<Joueur[]>([]);

  const addPlayersToState = function (joueurs: Joueur[]) {
      setPlayers(joueurs);
  };

  return (
    <AuthProvider {...cognitoAuthConfig}>
      <Component
        className={inter.className}
        {...pageProps}
        players={players}
        addPlayers={addPlayersToState}
      />
    </AuthProvider>
  );
}
