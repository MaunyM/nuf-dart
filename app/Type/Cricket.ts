import { startingMarks } from "../service/cricketService";
import { Game_Type, Joueur, Ring, Score } from "./Game";

export const CRICKET_ZONES = [20, 19, 18, 17, 16, 15, 25];

export type Marks = Record<number, number>

export class CricketScore implements Score<Game_Type.CRICKET> {
  marks: Marks = {};
  score: number = 0;
  joueur: Joueur;
  constructor(joueur:Joueur) {
    this.marks = startingMarks();
    this.score = 0;
    this.joueur = joueur;
  }
}


