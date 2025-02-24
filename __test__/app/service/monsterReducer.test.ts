import { expect, test } from "vitest";
import {
  DartThrow,
  Game,
  Game_State,
  Game_Type,
  Joueur,
} from "@/app/Type/Game";
import { defaultGame } from "@/app/service/defaultGame";
import { MonsterScore } from "@/app/Type/Monster";
import { monsterReduce } from "@/app/service/monsterService";

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

test("Score is initialised", () => {
  const game = { ...defaultGame, players, scores, status: Game_State.THROWING };
  const throws: DartThrow[] = [];
  const updatedGame = throws.reduce(monsterReduce, game);

  expect(updatedGame.throws.length).toBe(0);
  expect(updatedGame.scores.length).toEqual(3);
});

test("Monster game zone validation", () => {
  const game = { ...defaultGame, players, scores, status: Game_State.THROWING };
  const throws: DartThrow[] = [throw20];
  const updatedGame = throws.reduce(monsterReduce, game);
  console.log((updatedGame.scores[0] as MonsterScore).attack);
  expect(updatedGame.throws.length).toBe(1);
  expect((updatedGame.scores[0] as MonsterScore).attack.length).toEqual(0);
  expect((updatedGame.scores[0] as MonsterScore).heal.length).toEqual(1);
  expect((updatedGame.scores[1] as MonsterScore).attack.length).toEqual(3);
  expect((updatedGame.scores[1] as MonsterScore).heal.length).toEqual(0);
});