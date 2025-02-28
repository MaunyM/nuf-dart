import {Game_Type, Joueur, Score } from "./Game";

export const CRICKET_ZONES = [20, 19, 18, 17, 16, 15, 25];

export type Marks = Record<number, number>

export class _501Score implements Score {
  score: number = 0;
  joueur: Joueur;
  type = Game_Type._501;
  last_score: number = 0;
  average: number = 0;
  volley_count:number=0;
  volley_score:number=0;
  constructor(joueur:Joueur) {
    this.score = 501;
    this.joueur = joueur;
  }
}


