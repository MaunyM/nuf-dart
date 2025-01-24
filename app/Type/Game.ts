import { CricketScore } from "./Cricket";
import { Color } from "./Math";

export type Section = {
  value: number;
  status: boolean;
};

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
  WON
}

export type Score = {
  add: (value: number, ring: Ring) => Score;
};

export type Joueur<T extends Score> = {
  id:number,
  score: T;
  nom: string;
  dart_count?: number;
  color: Color;
};

export type JoueurCricket = Joueur<CricketScore>

export type Game<T extends Score>= {
  sectionsOrder: number[];
  sections: Record<number, Section>;
  players: Joueur<T>[];
  current_player?: Joueur<T>;
  status: Game_State;
  dart_count: number;
  addPlayers(players :Joueur<T>[]):void;
  tapHandler(value: number, ring: Ring): void;
  startGame(): void;
  ready(): void;
  next_player?: Joueur<T>;
};
