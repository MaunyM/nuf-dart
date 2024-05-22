import { Joueur, Score } from "../Type/Game";

export function getIndexFromPlayers<T extends Score>( current_player: Joueur<T>, players: Joueur<T>[]) {
    return players.findIndex(
        (player) => player.nom === current_player?.nom
      );
}