import { expect, test } from "vitest";
import {
  DartThrow,
  Game,
  Game_State,
  Joueur,
  Ring,
} from "@/app/Type/Game";
import { defaultGame } from "@/app/service/defaultGame";
import { MonsterScore } from "@/app/Type/Monster";
import { MonsterReducer } from "@/app/service/monsterService";

const matthieu: Joueur = {
  id: 1,
  nom: "Matthieu",
  color: {
    h: 0,
    s: 0,
    l: 0,
  },
};

const patate: Joueur = {
  id: 3,
  nom: "Patate",
  color: {
    h: 0,
    s: 0,
    l: 0,
  },
};

const celia: Joueur = {
  id: 2,
  nom: "Celia",
  color: {
    h: 0,
    s: 0,
    l: 0,
  },
};
const winner: Joueur = {
  id: 4,
  nom: "Winner",
  color: {
    h: 0,
    s: 0,
    l: 0,
  },
};

const allOpenPlayer: Joueur = {
  id: 5,
  nom: "allOpen",
  color: {
    h: 0,
    s: 0,
    l: 0,
  },
};

const throw20: DartThrow = {
  player: matthieu,
  value: 20,
  ring: 1,
  date: new Date("1995-12-17T03:24:00"),
};

const throw12: DartThrow = {
  player: matthieu,
  value: 12,
  ring: 0,
  date: new Date("1995-12-17T03:25:00"),
};
const players = [matthieu, patate, celia];
const scores = players.map((player) => new MonsterScore(player));
const TwoPlayers = [matthieu, celia];

test("MonsterReducer.reduce renseigne targetZones avec l'union de la zone de soin et des zones d'attaque adverses", () => {
  const scoresWithZones = TwoPlayers.map((player) => new MonsterScore(player));
  scoresWithZones[0].zone = [6]; // zone de soin du joueur courant
  scoresWithZones[1].zone = [1, 2, 3]; // zones d'attaque de l'adversaire

  const game: Game = {
    ...defaultGame,
    status: Game_State.THROWING,
    players: TwoPlayers,
    scores: scoresWithZones,
    current_player: matthieu,
    dart_count: 3,
  };

  const dartThrow: DartThrow = {
    player: matthieu,
    value: 1,
    ring: Ring.SIMPLE_TOP,
    date: new Date(),
  };

  const updatedGame = new MonsterReducer().reduce(game, dartThrow);

  expect(updatedGame.throws[0].targetZones).toEqual([6, 1, 2, 3]);
});

test("MonsterReducer.reduce renvoie targetZones vide si aucun joueur n'a de zone assignée", () => {
  const scoresWithoutZones = TwoPlayers.map((player) => new MonsterScore(player));

  const game: Game = {
    ...defaultGame,
    status: Game_State.THROWING,
    players: TwoPlayers,
    scores: scoresWithoutZones,
    current_player: matthieu,
    dart_count: 3,
  };

  const dartThrow: DartThrow = {
    player: matthieu,
    value: 6,
    ring: Ring.SIMPLE_TOP,
    date: new Date(),
  };

  const updatedGame = new MonsterReducer().reduce(game, dartThrow);

  expect(updatedGame.throws[0].targetZones).toEqual([]);
});