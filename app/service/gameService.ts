import useSWR from "swr";
import { Game, Joueur, Score } from "../Type/Game";
import { JoueurWithElo } from "../Type/Elo";
import { AuthContextProps } from "react-oidc-context";
import { cognitoAuthConfig, cognitoDomain } from "./authConfig";

const base_api = process.env.NEXT_PUBLIC_API;


export function getIndexFromPlayers(current_player: Joueur, scores: Score[]) {
  return scores.findIndex((score) => score.joueur.id === current_player?.id);
}

export function getIndexFromScores(current_score: Score, scores: Score[]) {
  return scores.findIndex((score) => score.joueur.id === current_score?.joueur.id);
}

export function getScoreFromPlayer(
  scores: Score[],
  player: Joueur
): Score | undefined {
  return scores.find((score) => score.joueur.id === player.id);
}

export function updatePlayerScore(current_score: Score, scores: Score[]) {
  const index = getIndexFromScores(current_score, scores);
  scores[index] = current_score;
  return [...scores];
}

export function addPlayer(players: Joueur[], player: Joueur) {
  return [...players, player];
}

export function removePlayer(players: Joueur[], player: Joueur) {
  return [...players.filter((p) => player.id !== p.id)];
}

const authFetcher = (token: string = "") =>
  async function fetcher<JSON = any>(input: RequestInfo): Promise<JSON> {
    const res = await fetch(input, {
      headers: {
        "content-type": "application/json",
        accept: "application/json",
        Authorization: token,
      },
    });
    return res.json();
  };

export function addPlayers(
  players: Joueur[],
  game: Game
): Game {
  return { ...game, players: [ ...players ]};
}

export function resumeSessionOnReconnect(auth: AuthContextProps): () => void {
  const handleOnline = () => {
    if (auth.user?.expired) {
      auth.signinSilent().catch(() => {});
    }
  };

  window.addEventListener("online", handleOnline);
  return () => window.removeEventListener("online", handleOnline);
}

export function subscribeToSessionExpiry(auth: AuthContextProps, onExpired: () => void): () => void {
  auth.events.addSilentRenewError(onExpired);
  auth.events.addUserSignedOut(onExpired);

  return () => {
    auth.events.removeSilentRenewError(onExpired);
    auth.events.removeUserSignedOut(onExpired);
  };
}

export async function signOut(auth: AuthContextProps): Promise<void> {
  // Cognito's /oauth2/revoke endpoint only supports revoking the refresh_token;
  // requesting access_token revocation returns "unsupported_token_type".
  await auth.revokeTokens(["refresh_token"]);
  await auth.removeUser();
  // Cognito's hosted UI keeps its own SSO session cookie, which `removeUser()`
  // does not clear. Redirecting to its /logout endpoint (with the Cognito-specific
  // client_id + logout_uri params, registered as a sign-out URL) ends that SSO
  // session so the next "Sign in" prompts for credentials again.
  const logoutUri = encodeURIComponent(cognitoAuthConfig.redirect_uri);
  window.location.href = `${cognitoDomain}/logout?client_id=${cognitoAuthConfig.client_id}&logout_uri=${logoutUri}`;
}

export async function getValidToken(auth: AuthContextProps): Promise<string | undefined> {
  if (!auth.user || auth.user.expired) {
    try {
      const user = await auth.signinSilent();
      return user?.id_token;
    } catch {
      return undefined;
    }
  }
  return auth.user.id_token;
}

export function saveGameState(game: Game, token: string) {
  fetch(`${base_api}/game`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(game),
  }).catch(() => {});
}

export async function restoreGame(): Promise<Game | undefined> {
  try {
    const res = await fetch(`${base_api}/game`);
    if (!res.ok) {
      return undefined;
    }
    return await res.json();
  } catch {
    return undefined;
  }
}

const publicFetcher = (url: string) => fetch(url).then((r) => r.json());

export function usePlayers(_auth: AuthContextProps) {
  const { data, error, isLoading } = useSWR<JoueurWithElo[]>(
    `${base_api}/elo`,
    publicFetcher
  );

  return {
    players: data,
    isLoading,
    isError: error,
  };
}
