import { DartThrow, Game_Type, Joueur, Ring, Score } from "./Game";

export class MonsterScore implements Score {
  score: number = 10;
  maxScore: number = 10;
  joueur: Joueur;
  type = Game_Type.MONSTER;
  teamId: number;
  zone? : number[];
  constructor(joueur:Joueur, zone?: number[], teamId?: number, maxScore: number = 10) {
    this.joueur = joueur;
    this.zone = zone;
    this.teamId = teamId ?? joueur.id;
    this.maxScore = maxScore;
    this.score = maxScore;
  }
}

export type MonsterZones=  Map<number, number[]>

