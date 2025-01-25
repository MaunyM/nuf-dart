import useSWR, { Fetcher } from "swr";
import { Joueur, JoueurCricket, Score } from "../Type/Game";
import { AuthContextProps } from "react-oidc-context";

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

  const authFetcher = (token:string="") =>  async function  fetcher<JSON = any>(
  input: RequestInfo
): Promise<JSON> {
  const res = await fetch(input, {headers :{
    "content-type": "application/json",
    accept: "application/json",
    Authorization: token
  }})
  return res.json()
}

export function usePlayers (auth:AuthContextProps) {
  const { data, error, isLoading } = useSWR<JoueurCricket[]>(`${base_api}/players`, authFetcher(auth.user?.id_token))
 
  return {
    players: data,
    isLoading,
    isError: error
  }
}