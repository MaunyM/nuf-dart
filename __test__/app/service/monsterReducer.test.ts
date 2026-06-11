import { expect, test } from "vitest";
import {
  DartThrow,
  Game,
  Game_State,
  Joueur,
  Ring,
  Team,
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

const teams2v2: Team[] = [
  { id: 1, name: "Équipe 1", players: [matthieu, patate] },
  { id: 2, name: "Équipe 2", players: [celia, winner] },
];

test("MonsterReducer mode équipe : chaque équipe démarre avec 20 PV (10 x effectif)", () => {
  const reducer = new MonsterReducer([matthieu, celia, patate, winner], teams2v2);
  expect(reducer.getTeamId(matthieu)).toBe(1);
  expect(reducer.getTeamId(patate)).toBe(1);
  expect(reducer.getTeamId(celia)).toBe(2);
  expect(reducer.getTeamId(winner)).toBe(2);
  expect(reducer.getMaxScore(matthieu)).toBe(20);
  expect(reducer.getMaxScore(celia)).toBe(20);
});

test("MonsterReducer mode équipe : le soin profite à toute l'équipe, plafonné à maxScore", () => {
  const scoreMatthieu = new MonsterScore(matthieu, [6], 1, 20);
  scoreMatthieu.score = 15;
  const scorePatate = new MonsterScore(patate, undefined, 1, 20);
  scorePatate.score = 15;
  const scoreCelia = new MonsterScore(celia, [1, 2, 3], 2, 20);
  const scoreWinner = new MonsterScore(winner, [4, 5, 7], 2, 20);

  const game: Game = {
    ...defaultGame,
    status: Game_State.THROWING,
    players: [matthieu, celia, patate, winner],
    scores: [scoreMatthieu, scorePatate, scoreCelia, scoreWinner],
    teams: teams2v2,
    current_player: matthieu,
    dart_count: 3,
  };

  const dartThrow: DartThrow = {
    player: matthieu,
    value: 6,
    ring: Ring.SIMPLE_TOP,
    date: new Date(),
  };

  const updatedGame = new MonsterReducer([matthieu, celia, patate, winner], teams2v2).reduce(game, dartThrow);
  const scores = updatedGame.scores as MonsterScore[];
  expect(scores.find((s) => s.joueur.id === matthieu.id)?.score).toBe(16);
  expect(scores.find((s) => s.joueur.id === patate.id)?.score).toBe(16);
  expect(scores.find((s) => s.joueur.id === celia.id)?.score).toBe(20);
});

test("MonsterReducer mode équipe : le soin reste plafonné à maxScore quand l'équipe est déjà au maximum", () => {
  const scoreMatthieu = new MonsterScore(matthieu, [6], 1, 20);
  const scorePatate = new MonsterScore(patate, undefined, 1, 20);
  const scoreCelia = new MonsterScore(celia, [1, 2, 3], 2, 20);
  const scoreWinner = new MonsterScore(winner, [4, 5, 7], 2, 20);

  const game: Game = {
    ...defaultGame,
    status: Game_State.THROWING,
    players: [matthieu, celia, patate, winner],
    scores: [scoreMatthieu, scorePatate, scoreCelia, scoreWinner],
    teams: teams2v2,
    current_player: matthieu,
    dart_count: 3,
  };

  const dartThrow: DartThrow = {
    player: matthieu,
    value: 6,
    ring: Ring.SIMPLE_TOP,
    date: new Date(),
  };

  const updatedGame = new MonsterReducer([matthieu, celia, patate, winner], teams2v2).reduce(game, dartThrow);
  const scores = updatedGame.scores as MonsterScore[];
  expect(scores.find((s) => s.joueur.id === matthieu.id)?.score).toBe(20);
  expect(scores.find((s) => s.joueur.id === patate.id)?.score).toBe(20);
});

test("MonsterReducer mode équipe : l'attaque sur un adversaire inflige -1 à toute son équipe", () => {
  const scoreMatthieu = new MonsterScore(matthieu, [6], 1, 20);
  const scorePatate = new MonsterScore(patate, undefined, 1, 20);
  const scoreCelia = new MonsterScore(celia, [1, 2, 3], 2, 20);
  const scoreWinner = new MonsterScore(winner, [4, 5, 7], 2, 20);

  const game: Game = {
    ...defaultGame,
    status: Game_State.THROWING,
    players: [matthieu, celia, patate, winner],
    scores: [scoreMatthieu, scorePatate, scoreCelia, scoreWinner],
    teams: teams2v2,
    current_player: matthieu,
    dart_count: 3,
  };

  const dartThrow: DartThrow = {
    player: matthieu,
    value: 1, // zone d'attaque de Celia (équipe adverse)
    ring: Ring.SIMPLE_TOP,
    date: new Date(),
  };

  const updatedGame = new MonsterReducer([matthieu, celia, patate, winner], teams2v2).reduce(game, dartThrow);
  const scores = updatedGame.scores as MonsterScore[];
  expect(scores.find((s) => s.joueur.id === celia.id)?.score).toBe(19);
  expect(scores.find((s) => s.joueur.id === winner.id)?.score).toBe(19);
  expect(scores.find((s) => s.joueur.id === matthieu.id)?.score).toBe(20);
});

test("MonsterReducer mode équipe : tir ami sur la zone d'un coéquipier inflige -1 à sa propre équipe", () => {
  const scoreMatthieu = new MonsterScore(matthieu, [6], 1, 20); // zone de soin de Matthieu
  const scorePatate = new MonsterScore(patate, [8, 9, 10], 1, 20); // zone d'attaque assignée à Patate (coéquipier de Matthieu)
  const scoreCelia = new MonsterScore(celia, [1, 2, 3], 2, 20);
  const scoreWinner = new MonsterScore(winner, [4, 5, 7], 2, 20);

  const game: Game = {
    ...defaultGame,
    status: Game_State.THROWING,
    players: [matthieu, celia, patate, winner],
    scores: [scoreMatthieu, scorePatate, scoreCelia, scoreWinner],
    teams: teams2v2,
    current_player: matthieu,
    dart_count: 3,
  };

  const dartThrow: DartThrow = {
    player: matthieu,
    value: 8, // zone d'attaque de Patate, son propre coéquipier
    ring: Ring.SIMPLE_TOP,
    date: new Date(),
  };

  const updatedGame = new MonsterReducer([matthieu, celia, patate, winner], teams2v2).reduce(game, dartThrow);
  const scores = updatedGame.scores as MonsterScore[];
  expect(scores.find((s) => s.joueur.id === matthieu.id)?.score).toBe(19);
  expect(scores.find((s) => s.joueur.id === patate.id)?.score).toBe(19);
  expect(scores.find((s) => s.joueur.id === celia.id)?.score).toBe(20);
  expect(scores.find((s) => s.joueur.id === winner.id)?.score).toBe(20);
});

test("MonsterReducer mode équipe : une équipe à 0 PV est éliminée et l'équipe restante gagne", () => {
  const scoreMatthieu = new MonsterScore(matthieu, [6], 1, 20);
  const scorePatate = new MonsterScore(patate, undefined, 1, 20);
  const scoreCelia = new MonsterScore(celia, [1, 2, 3], 2, 20);
  scoreCelia.score = 1;
  const scoreWinner = new MonsterScore(winner, [4, 5, 7], 2, 20);
  scoreWinner.score = 1;

  const game: Game = {
    ...defaultGame,
    status: Game_State.THROWING,
    players: [matthieu, celia, patate, winner],
    scores: [scoreMatthieu, scorePatate, scoreCelia, scoreWinner],
    teams: teams2v2,
    current_player: matthieu,
    dart_count: 3,
  };

  const dartThrow: DartThrow = {
    player: matthieu,
    value: 1, // zone d'attaque de Celia (équipe adverse, à 1 PV)
    ring: Ring.SIMPLE_TOP,
    date: new Date(),
  };

  const updatedGame = new MonsterReducer([matthieu, celia, patate, winner], teams2v2).reduce(game, dartThrow);
  const scores = updatedGame.scores as MonsterScore[];
  expect(scores.every((s) => s.teamId === 1)).toBe(true);
  expect(scores.length).toBe(2);
  expect(updatedGame.status).toBe(Game_State.WON);
});

test("MonsterReducer mode individuel (sans teams) : non-régression sur teamId/maxScore et sur soin/attaque", () => {
  const reducer = new MonsterReducer([matthieu, celia]);
  expect(reducer.getTeamId(matthieu)).toBe(matthieu.id);
  expect(reducer.getMaxScore(matthieu)).toBe(10);

  const scoreMatthieu = new MonsterScore(matthieu, [6]);
  const scoreCelia = new MonsterScore(celia, [1, 2, 3]);

  const game: Game = {
    ...defaultGame,
    status: Game_State.THROWING,
    players: [matthieu, celia],
    scores: [scoreMatthieu, scoreCelia],
    current_player: matthieu,
    dart_count: 3,
  };

  const dartThrow: DartThrow = {
    player: matthieu,
    value: 1,
    ring: Ring.SIMPLE_TOP,
    date: new Date(),
  };

  const updatedGame = reducer.reduce(game, dartThrow);
  const scores = updatedGame.scores as MonsterScore[];
  expect(scores.find((s) => s.joueur.id === celia.id)?.score).toBe(9);
  expect(scores.find((s) => s.joueur.id === matthieu.id)?.score).toBe(10);
});