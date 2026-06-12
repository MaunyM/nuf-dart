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

test("MonsterReducer mode équipe : chaque joueur démarre avec 10 PV (maxScore=10), indépendamment de l'équipe", () => {
  const reducer = new MonsterReducer([matthieu, celia, patate, winner], teams2v2);
  expect(reducer.getTeamId(matthieu)).toBe(1);
  expect(reducer.getTeamId(patate)).toBe(1);
  expect(reducer.getTeamId(celia)).toBe(2);
  expect(reducer.getTeamId(winner)).toBe(2);

  const score = new MonsterScore(matthieu, undefined, reducer.getTeamId(matthieu));
  expect(score.maxScore).toBe(10);
  expect(score.score).toBe(10);
});

test("MonsterReducer mode équipe : le soin ne profite qu'au joueur dont la zone est touchée (FR-005)", () => {
  const scoreMatthieu = new MonsterScore(matthieu, [6], 1);
  scoreMatthieu.score = 8;
  const scorePatate = new MonsterScore(patate, undefined, 1);
  scorePatate.score = 8;
  const scoreCelia = new MonsterScore(celia, [1, 2, 3], 2);
  const scoreWinner = new MonsterScore(winner, [4, 5, 7], 2);

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
  expect(scores.find((s) => s.joueur.id === matthieu.id)?.score).toBe(9);
  expect(scores.find((s) => s.joueur.id === patate.id)?.score).toBe(8);
});

test("MonsterReducer mode équipe : le soin reste plafonné à 10 pour le joueur ciblé", () => {
  const scoreMatthieu = new MonsterScore(matthieu, [6], 1);
  const scorePatate = new MonsterScore(patate, undefined, 1);
  const scoreCelia = new MonsterScore(celia, [1, 2, 3], 2);
  const scoreWinner = new MonsterScore(winner, [4, 5, 7], 2);

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
  expect(scores.find((s) => s.joueur.id === matthieu.id)?.score).toBe(10);
  expect(scores.find((s) => s.joueur.id === patate.id)?.score).toBe(10);
});

test("MonsterReducer mode équipe : l'attaque sur un adversaire n'inflige -1 qu'au joueur ciblé (FR-006)", () => {
  const scoreMatthieu = new MonsterScore(matthieu, [6], 1);
  const scorePatate = new MonsterScore(patate, undefined, 1);
  const scoreCelia = new MonsterScore(celia, [1, 2, 3], 2);
  const scoreWinner = new MonsterScore(winner, [4, 5, 7], 2);

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
  expect(scores.find((s) => s.joueur.id === celia.id)?.score).toBe(9);
  expect(scores.find((s) => s.joueur.id === winner.id)?.score).toBe(10);
  expect(scores.find((s) => s.joueur.id === matthieu.id)?.score).toBe(10);
});

test("MonsterReducer mode équipe : tir ami sur la zone d'un coéquipier n'inflige -1 qu'à ce coéquipier (FR-006/FR-010)", () => {
  const scoreMatthieu = new MonsterScore(matthieu, [6], 1); // zone de soin de Matthieu
  const scorePatate = new MonsterScore(patate, [8, 9, 10], 1); // zone d'attaque assignée à Patate (coéquipier de Matthieu)
  const scoreCelia = new MonsterScore(celia, [1, 2, 3], 2);
  const scoreWinner = new MonsterScore(winner, [4, 5, 7], 2);

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
  expect(scores.find((s) => s.joueur.id === patate.id)?.score).toBe(9);
  expect(scores.find((s) => s.joueur.id === matthieu.id)?.score).toBe(10);
  expect(scores.find((s) => s.joueur.id === celia.id)?.score).toBe(10);
  expect(scores.find((s) => s.joueur.id === winner.id)?.score).toBe(10);
});

test("MonsterReducer mode équipe : un joueur éliminé individuellement reste affiché à 0 et ne reçoit plus de zone tant qu'un coéquipier est vivant (FR-007, Edge Cases)", () => {
  const scoreMatthieu = new MonsterScore(matthieu, [10, 11, 12], 1); // zone d'attaque assignée à Matthieu, à 1 PV
  scoreMatthieu.score = 1;
  const scorePatate = new MonsterScore(patate, undefined, 1);
  scorePatate.score = 5;
  const scoreCelia = new MonsterScore(celia, [6], 2); // zone de soin de Celia (joueuse courante)
  const scoreWinner = new MonsterScore(winner, undefined, 2);

  const game: Game = {
    ...defaultGame,
    status: Game_State.THROWING,
    players: [matthieu, celia, patate, winner],
    scores: [scoreMatthieu, scorePatate, scoreCelia, scoreWinner],
    teams: teams2v2,
    current_player: celia,
    dart_count: 1,
    round: 0,
  };

  const dartThrow: DartThrow = {
    player: celia,
    value: 10, // zone d'attaque de Matthieu : il tombe à 0
    ring: Ring.SIMPLE_TOP,
    date: new Date(),
  };

  const updatedGame = new MonsterReducer([matthieu, celia, patate, winner], teams2v2).reduce(game, dartThrow);
  const scores = updatedGame.scores as MonsterScore[];
  const matthieuScore = scores.find((s) => s.joueur.id === matthieu.id);

  // Matthieu tombe à 0 mais reste affiché : son équipe (Patate, 5 PV) est encore en jeu
  expect(matthieuScore?.score).toBe(0);
  expect(scores.length).toBe(4);
  expect(updatedGame.status).not.toBe(Game_State.WON);

  // Matthieu ne reçoit plus de zone (ni soin, ni cible) au tour suivant
  expect(matthieuScore?.zone).toBeUndefined();

  // Patate continue de recevoir des zones normalement
  const patateScore = scores.find((s) => s.joueur.id === patate.id);
  expect(patateScore?.zone).toBeDefined();
});

test("MonsterReducer mode équipe : une équipe est éliminée seulement quand TOUS ses membres sont à 0 PV (FR-007/FR-008)", () => {
  const scoreMatthieu = new MonsterScore(matthieu, undefined, 1);
  scoreMatthieu.score = 0; // déjà éliminé individuellement
  const scorePatate = new MonsterScore(patate, [10, 11, 12], 1); // zone d'attaque assignée à Patate, dernier membre vivant de l'équipe 1
  scorePatate.score = 1;
  const scoreCelia = new MonsterScore(celia, [6], 2); // zone de soin de Celia (joueuse courante)
  const scoreWinner = new MonsterScore(winner, undefined, 2);

  const game: Game = {
    ...defaultGame,
    status: Game_State.THROWING,
    players: [matthieu, celia, patate, winner],
    scores: [scoreMatthieu, scorePatate, scoreCelia, scoreWinner],
    teams: teams2v2,
    current_player: celia,
    dart_count: 1,
    round: 0,
  };

  const dartThrow: DartThrow = {
    player: celia,
    value: 10, // zone d'attaque de Patate : toute l'équipe 1 est désormais à 0
    ring: Ring.SIMPLE_TOP,
    date: new Date(),
  };

  const updatedGame = new MonsterReducer([matthieu, celia, patate, winner], teams2v2).reduce(game, dartThrow);
  const scores = updatedGame.scores as MonsterScore[];

  expect(scores.every((s) => s.teamId === 2)).toBe(true);
  expect(scores.length).toBe(2);
  expect(updatedGame.status).toBe(Game_State.WON);
});

test("MonsterReducer mode individuel (sans teams) : non-régression sur teamId et sur soin/attaque", () => {
  const reducer = new MonsterReducer([matthieu, celia]);
  expect(reducer.getTeamId(matthieu)).toBe(matthieu.id);

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

test("MonsterReducer mode équipe : un joueur à 0 PV est entièrement sauté lors de la rotation (FR-009, clarification 2026-06-12)", () => {
  const scoreMatthieu = new MonsterScore(matthieu, undefined, 1);
  scoreMatthieu.score = 0; // A1 éliminé individuellement, mais l'équipe 1 (Patate) est encore vivante
  const scorePatate = new MonsterScore(patate, undefined, 1);
  const scoreCelia = new MonsterScore(celia, undefined, 2);
  const scoreWinner = new MonsterScore(winner, undefined, 2);

  const game: Game = {
    ...defaultGame,
    status: Game_State.THROWING,
    players: [matthieu, patate, celia, winner],
    scores: [scoreMatthieu, scorePatate, scoreCelia, scoreWinner],
    teams: teams2v2,
    current_player: winner,
    dart_count: 1,
    round: 0,
  };

  const dartThrow: DartThrow = {
    player: winner,
    value: 1,
    ring: Ring.SIMPLE_TOP,
    date: new Date(),
  };

  const updatedGame = new MonsterReducer([matthieu, patate, celia, winner], teams2v2).reduce(game, dartThrow);
  const scores = updatedGame.scores as MonsterScore[];

  // Matthieu (A1, 0 PV) est entièrement sauté : aucune zone ne lui est attribuée pour ce tour
  expect(scores.find((s) => s.joueur.id === matthieu.id)?.zone).toBeUndefined();

  // le tour passe directement à Patate (A2, > 0 PV), le joueur suivant après Matthieu
  expect(updatedGame.current_player?.id).toBe(patate.id);

  // round n'avance que de 1, même si Matthieu a été sauté
  expect(updatedGame.round).toBe(1);
});

test("MonsterReducer mode équipe : plusieurs joueurs consécutifs à 0 PV sont sautés en un seul tour (élimination en cascade, FR-009)", () => {
  const scoreMatthieu = new MonsterScore(matthieu, undefined, 1);
  scoreMatthieu.score = 0; // A1 éliminé individuellement
  const scoreCelia = new MonsterScore(celia, undefined, 2);
  scoreCelia.score = 0; // B1 éliminé individuellement
  const scorePatate = new MonsterScore(patate, undefined, 1); // A2, encore vivant
  const scoreWinner = new MonsterScore(winner, undefined, 2); // B2, encore vivant

  const game: Game = {
    ...defaultGame,
    status: Game_State.THROWING,
    players: [matthieu, celia, patate, winner],
    scores: [scoreMatthieu, scoreCelia, scorePatate, scoreWinner],
    teams: teams2v2,
    current_player: winner,
    dart_count: 1,
    round: 0,
  };

  const dartThrow: DartThrow = {
    player: winner,
    value: 1,
    ring: Ring.SIMPLE_TOP,
    date: new Date(),
  };

  const updatedGame = new MonsterReducer([matthieu, celia, patate, winner], teams2v2).reduce(game, dartThrow);
  const scores = updatedGame.scores as MonsterScore[];

  // Matthieu et Celia (tous deux à 0 PV) sont sautés en un seul reduce, aucune zone ne leur est attribuée
  expect(scores.find((s) => s.joueur.id === matthieu.id)?.zone).toBeUndefined();
  expect(scores.find((s) => s.joueur.id === celia.id)?.zone).toBeUndefined();

  // le tour passe directement à Patate (A2, > 0 PV), premier joueur suivant avec score > 0
  expect(updatedGame.current_player?.id).toBe(patate.id);

  // round n'avance que de 1, malgré les deux joueurs sautés
  expect(updatedGame.round).toBe(1);
});