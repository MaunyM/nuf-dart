
import { Color } from "./Math";

export const sectionsOrder= [
  6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5, 20, 1, 18, 4, 13,
];

export enum Game_Type {
  CRICKET,
  X01,
  MONSTER
}

export enum Ring {
  TRIPLE,
  SIMPLE_TOP,
  DOUBLE,
  SIMPLE_BOTTOM,
  BULL,
}

export const mults: Record<Ring, number> = {
  [Ring.TRIPLE]: 3,
  [Ring.SIMPLE_TOP]: 1,
  [Ring.DOUBLE]: 2,
  [Ring.SIMPLE_BOTTOM]: 1,
  [Ring.BULL]: 1,
};

export enum Game_State {
  CHOOSE_PLAYER,
  UNSTARTED,
  THROWING,
  WAITING_NEXT_PLAYER,
  WON,
}

export type Score = {
  joueur: Joueur
  type: Game_Type
};

export interface Joueur{
  id:number,
  nom: string;
  color: Color;
};

export enum Game_Event {
  DART_HIT,
}

export interface DartThrow {
  player: Joueur;
  value: number;
  ring: Ring;
  date: Date;
};

export type Game = {
  throws: DartThrow[]
  current_player?: Joueur;
  status: Game_State;
  dart_count: number;
  scores:Score[];
  players_:Joueur[];
  round:number;
};
