import { Game_Type, Joueur } from "./Game";

export const ELO_MIN_GAMES = 3;

export type EloByGameType = {
  cricket: number;
  x01: number;
  monster: number;
};

export type JoueurWithElo = Joueur & {
  elo?: EloByGameType;
  gamesPlayed?: EloByGameType;
  eloDelta?: EloByGameType;
};

export type EloRankingEntry = {
  joueur: JoueurWithElo;
  elo: number;
  gamesPlayed: number;
  eloDelta: number;
  ranked: boolean;
};

export type PredictionResult = {
  joueur: Joueur;
  winProbability: number | null;
};

export const GAME_TYPE_KEY: Record<Game_Type, keyof EloByGameType> = {
  [Game_Type.CRICKET]: "cricket",
  [Game_Type.X01]: "x01",
  [Game_Type.MONSTER]: "monster",
};
