import useSWR, { Fetcher } from "swr";
import { Joueur, JoueurCricket, Score } from "../Type/Game";

const base_api = process.env.NEXT_PUBLIC_API

export function getIndexFromPlayers<T extends Score>( current_player: Joueur<T>, players: Joueur<T>[]) {
    return players.findIndex(
        (player) => player.nom === current_player?.nom
      );
}

export function addPlayer<T extends Score>(players:Joueur<T>[], player: Joueur<T>) {
  return [...players, player]
}

export function removePlayer<T extends Score>(players:Joueur<T>[], player: Joueur<T>) {
  return [...players.filter(p => player.id !== p.id)]
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
  const { data, error, isLoading } = useSWR<JoueurCricket[]>(`${base_api}/players`, fetcher)
 
  return {
    players: data,
    isLoading,
    isError: error
  }
}