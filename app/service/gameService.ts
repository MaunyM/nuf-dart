import useSWR from "swr";
import { Game, Joueur, Score } from "../Type/Game";
import { AuthContextProps } from "react-oidc-context";

const base_api = process.env.NEXT_PUBLIC_API;

export const delay = (ms:number) => new Promise(res => setTimeout(res, ms));

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
  return { ...game, players_: [ ...players ]};
}

export function usePlayers(auth: AuthContextProps) {
  const { data, error, isLoading } = useSWR<Joueur[]>(
    `${base_api}/players`,
    authFetcher(auth.user?.id_token)
  );

  return {
    players: data,
    isLoading,
    isError: error,
  };
}
