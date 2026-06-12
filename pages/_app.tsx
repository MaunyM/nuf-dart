import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { AuthProvider, useAuth } from "react-oidc-context";
import {
  Joueur,
  Team,
} from "@/app/Type/Game";
import { cognitoAuthConfig } from "@/app/service/authConfig";
import { resumeSessionOnReconnect, subscribeToSessionExpiry } from "@/app/service/gameService";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const inter = Inter({ subsets: ["latin"] });

type AppContentProps = Pick<AppProps, "Component" | "pageProps"> & {
  players: Joueur[];
  addPlayers: (joueurs: Joueur[]) => void;
  seriesTarget: number;
  setSeriesTarget: (seriesTarget: number) => void;
  teams: Team[];
  setTeams: (teams: Team[]) => void;
};

function AppContent({ Component, pageProps, players, addPlayers, seriesTarget, setSeriesTarget, teams, setTeams }: AppContentProps) {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => resumeSessionOnReconnect(auth), [auth]);

  useEffect(() => {
    return subscribeToSessionExpiry(auth, () => {
      router.replace("/?sessionExpired=1");
    });
  }, [auth, router]);

  return (
    <Component
      className={inter.className}
      {...pageProps}
      players={players}
      addPlayers={addPlayers}
      seriesTarget={seriesTarget}
      setSeriesTarget={setSeriesTarget}
      teams={teams}
      setTeams={setTeams}
    />
  );
}

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [players, setPlayers] = useState<Joueur[]>([]);
  const [seriesTarget, setSeriesTarget] = useState<number>(1);
  const [teams, setTeams] = useState<Team[]>([]);

  const addPlayersToState = function (joueurs: Joueur[]) {
      setPlayers(joueurs);
  };

  return (
    <AuthProvider {...cognitoAuthConfig} onSigninCallback={() => { router.replace(router.pathname); }}>
      <AppContent
        Component={Component}
        pageProps={pageProps}
        players={players}
        addPlayers={addPlayersToState}
        seriesTarget={seriesTarget}
        setSeriesTarget={setSeriesTarget}
        teams={teams}
        setTeams={setTeams}
      />
    </AuthProvider>
  );
}
