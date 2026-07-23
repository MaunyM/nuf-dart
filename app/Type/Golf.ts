import { Game_Type, Joueur, Score } from "./Game";

export class GolfScore implements Score {
  joueur: Joueur;
  type = Game_Type.GOLF;
  strokes: (number | undefined)[] = [];
  total: number = 0;
  constructor(joueur: Joueur) {
    this.joueur = joueur;
  }
}
