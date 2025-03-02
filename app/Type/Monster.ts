import { DartThrow, Game_Type, Joueur, Ring, Score } from "./Game";

export class MonsterScore implements Score {
  score: number = 10;
  joueur: Joueur;
  type = Game_Type.MONSTER;
  zone? : number[];
  constructor(joueur:Joueur, zone?: number[]) {
    this.joueur = joueur;
    this.zone = zone;
  }
}

export type MonsterZones=  Map<number, number[]>

