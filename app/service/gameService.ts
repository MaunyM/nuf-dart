import useSWR from "swr";
import { Game, Game_Type, Joueur, Score } from "../Type/Game";
import { AuthContextProps } from "react-oidc-context";
import { S } from "vitest/dist/chunks/config.BRtC-JeT.js";

const base_api = process.env.NEXT_PUBLIC_API;

export const delay = (ms:number) => new Promise(res => setTimeout(res, ms));

export function getIndexFromPlayers(current_player: Joueur, players: Joueur[]) {
  return players.findIndex((player) => player.nom === current_player?.nom);
}

export function getIndexFromScores<T extends Game_Type>(current_score: Score<T>, scores: Score<T>[]) {
  return scores.findIndex((score) => score.joueur.id === current_score?.joueur.id);
}

export function getScoreFromPlayer<T extends Game_Type>(player: Joueur, scores: Score<T>[]):Score<T>|undefined {
  return scores.find((score) => score.joueur.id === player.id);
}

export function updatePlayers(current_player: Joueur, players: Joueur[]) {
  const index = getIndexFromPlayers(current_player, players);
  players[index] = current_player;
  return [...players];
}

export function updatePlayerScore<T extends Game_Type>(current_score: Score<T>, scores: Score<T>[]) {
  const index = getIndexFromScores<T>(current_score, scores);
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

export function addPlayers<T extends Game_Type>(
  players: Joueur[],
  game: Game<T>
): Game<T> {
  return { ...game, players: [ ...players ]};
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
