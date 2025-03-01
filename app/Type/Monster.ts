import { DartThrow, Game_Type, Joueur, Ring, Score } from "./Game";

export class MonsterScore implements Score {
  score: number = 10;
  joueur: Joueur;
  type = Game_Type.MONSTER;
  constructor(joueur:Joueur) {
    this.joueur = joueur;
  }
}

export interface MonsterJoueur extends Joueur{
  zone : number[]
}

export type MonsterZones=  Map<number, number[]>

