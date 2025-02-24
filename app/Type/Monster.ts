import { DartThrow, Game_Type, Joueur, Ring, Score } from "./Game";

export class MonsterScore implements Score {
  attack: number[] = [];
  heal: number[] = [];
  score: number = 0;
  joueur: Joueur;
  type = Game_Type.MONSTER;
  constructor(joueur:Joueur) {
    this.score = 0;
    this.joueur = joueur;
  }
}

export class MonsterThrow implements DartThrow  {
  player: Joueur;
  value: number;
  ring: Ring;
  date: Date;
  joueurZones : Map<Joueur, number[]>
  constructor(dartThrow : DartThrow, joueurZones: Map<Joueur, number[]>) {
    this.joueurZones = joueurZones;
    this.player = dartThrow.player;
    this.value = dartThrow.value;
    this.ring = dartThrow.ring;
    this.date = dartThrow.date;
  } 
};
