import useSWR, { Fetcher } from "swr";
import { Joueur, JoueurCricket, Score } from "../Type/Game";

export function getIndexFromPlayers<T extends Score>( current_player: Joueur<T>, players: Joueur<T>[]) {
    return players.findIndex(
        (player) => player.nom === current_player?.nom
      );
}

 async function fetcher<JSON = any>(
  input: RequestInfo
): Promise<JSON> {
  const res = await fetch(input, {headers :{
    "content-type": "application/json",
    accept: "application/json",
  }})
  return res.json()
}

export function usePlayers () {
  const { data, error, isLoading } = useSWR<JoueurCricket[]>(`https://api.dart.larus.fr/dart`, fetcher)
 
  return {
    players: data,
    isLoading,
    isError: error
  }
}