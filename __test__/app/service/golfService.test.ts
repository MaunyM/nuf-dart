import { expect, test } from "vitest";
import { DartThrow, Game, Game_State, Joueur, Ring } from "@/app/Type/Game";
import { defaultGame } from "@/app/service/defaultGame";
import { GolfScore } from "@/app/Type/Golf";
import {
  GOLF_HOLES,
  golfReduce,
  strokesForDart,
} from "@/app/service/golfService";

const matthieu: Joueur = { id: 1, nom: "Matthieu", color: { h: 0, s: 0, l: 0 } };
const celia: Joueur = { id: 2, nom: "Celia", color: { h: 0, s: 0, l: 0 } };

function makeThrow(value: number, ring: Ring): DartThrow {
  return { player: matthieu, value, ring, date: new Date() };
}

test("strokesForDart : double du secteur cible vaut 1 coup", () => {
  expect(strokesForDart(makeThrow(9, Ring.DOUBLE), 9)).toBe(1);
});

test("strokesForDart : simple extérieur du secteur cible vaut 2 coups", () => {
  expect(strokesForDart(makeThrow(9, Ring.SIMPLE_TOP), 9)).toBe(2);
});

test("strokesForDart : triple du secteur cible vaut 3 coups", () => {
  expect(strokesForDart(makeThrow(9, Ring.TRIPLE), 9)).toBe(3);
});

test("strokesForDart : simple intérieur du secteur cible vaut 4 coups", () => {
  expect(strokesForDart(makeThrow(9, Ring.SIMPLE_BOTTOM), 9)).toBe(4);
});

test("strokesForDart : un autre numéro que la cible vaut 5 coups", () => {
  expect(strokesForDart(makeThrow(5, Ring.DOUBLE), 9)).toBe(5);
});

test("strokesForDart : le bull vaut 5 coups (n'est jamais le secteur cible)", () => {
  expect(strokesForDart(makeThrow(25, Ring.BULL), 9)).toBe(5);
});

test("strokesForDart : une fléchette manquée (value=0) vaut 5 coups", () => {
  expect(strokesForDart(makeThrow(0, Ring.SIMPLE_BOTTOM), 9)).toBe(5);
});

test("golfReduce : seule la dernière fléchette du trou compte pour le score", () => {
  const players = [matthieu];
  const scores = [new GolfScore(matthieu)];
  let game: Game = {
    ...defaultGame,
    status: Game_State.THROWING,
    players,
    scores,
    current_player: matthieu,
    round: 0,
    dart_count: 3,
  };

  // trou 1 (secteur 1) : triple (3 coups) puis un raté (5 coups) qui écrase le score
  // (on évite le double ici : il validerait automatiquement le trou dès la 1ère fléchette)
  game = golfReduce(game, makeThrow(1, Ring.TRIPLE));
  game = golfReduce(game, makeThrow(0, Ring.SIMPLE_BOTTOM));

  const scoreAfterTwoDarts = (game.scores as GolfScore[])[0];
  expect(scoreAfterTwoDarts.strokes[0]).toBe(5);
  expect(scoreAfterTwoDarts.total).toBe(5);
});

test("golfReduce : le total cumule les trous joués", () => {
  const players = [matthieu];
  let game: Game = {
    ...defaultGame,
    status: Game_State.THROWING,
    players,
    scores: [new GolfScore(matthieu)],
    current_player: matthieu,
    round: 0,
    dart_count: 3,
  };

  // trou 1 (secteur 1) : double -> 1 coup, validé automatiquement dès la 1ère fléchette
  game = golfReduce(game, makeThrow(1, Ring.DOUBLE));
  // trou 2 (secteur 2) : simple extérieur -> 2 coups
  for (let i = 0; i < 3; i++) {
    game = golfReduce(game, makeThrow(2, Ring.SIMPLE_TOP));
  }

  const score = (game.scores as GolfScore[])[0];
  expect(score.strokes[0]).toBe(1);
  expect(score.strokes[1]).toBe(2);
  expect(score.total).toBe(3);
});

test("golfReduce : à la fin des 9 trous, le vainqueur est le joueur au total le plus bas, même si ce n'est pas lui qui vient de lancer", () => {
  const players = [matthieu, celia];

  const matthieuScore = new GolfScore(matthieu);
  matthieuScore.strokes = Array(GOLF_HOLES).fill(1); // 9 trous déjà finis, total 9 (le meilleur score possible)
  matthieuScore.total = 9;

  const celiaScore = new GolfScore(celia);
  celiaScore.strokes = Array(8).fill(1); // 8 premiers trous finis à 1 coup chacun
  celiaScore.total = 8;

  // Dernier tour de la partie (round 17 = 2 joueurs * 9 trous - 1) : c'est au tour de Celia
  // sur le dernier trou (secteur 9). Un raté ici (5 coups) fait grimper son total à 13,
  // ce qui doit désigner Matthieu vainqueur alors que c'est Celia qui vient de lancer.
  let game: Game = {
    ...defaultGame,
    status: Game_State.THROWING,
    players,
    scores: [matthieuScore, celiaScore],
    current_player: celia,
    round: GOLF_HOLES * players.length - 1,
    dart_count: 1,
  };

  game = golfReduce(game, makeThrow(0, Ring.SIMPLE_BOTTOM));

  expect(game.status).toBe(Game_State.WON);
  expect(game.current_player?.id).toBe(matthieu.id);
});

test("golfReduce : un arrêt anticipé fige le score de la dernière fléchette réelle sans en rejouer une nouvelle", () => {
  const players = [matthieu, celia];
  let game: Game = {
    ...defaultGame,
    status: Game_State.THROWING,
    players,
    scores: [new GolfScore(matthieu), new GolfScore(celia)],
    current_player: matthieu,
    round: 0,
    dart_count: 3,
  };

  // Matthieu fait le simple extérieur du secteur cible (2 coups) sur sa première
  // fléchette, puis décide de s'arrêter plutôt que de risquer un score de 3, 4 ou 5.
  game = golfReduce(game, makeThrow(1, Ring.SIMPLE_TOP));
  game = golfReduce(game, { ...makeThrow(0, Ring.SIMPLE_BOTTOM), stopTurn: true });

  const matthieuScore = (game.scores as GolfScore[])[0];
  expect(matthieuScore.strokes[0]).toBe(2);
  expect(matthieuScore.total).toBe(2);
  // Le tour est bien terminé (passage à Célia) sans qu'une fléchette fictive
  // n'apparaisse dans l'historique affiché à l'écran.
  expect(game.current_player?.id).toBe(celia.id);
  expect(game.throws.length).toBe(1);
});

test("golfReduce : un double sur la cible valide automatiquement le trou dès la première fléchette", () => {
  const players = [matthieu, celia];
  let game: Game = {
    ...defaultGame,
    status: Game_State.THROWING,
    players,
    scores: [new GolfScore(matthieu), new GolfScore(celia)],
    current_player: matthieu,
    round: 0,
    dart_count: 3,
  };

  // Matthieu fait le double du secteur cible (1 coup, le meilleur score possible)
  // dès sa première fléchette : inutile de rejouer, le tour se termine seul.
  game = golfReduce(game, makeThrow(1, Ring.DOUBLE));

  const matthieuScore = (game.scores as GolfScore[])[0];
  expect(matthieuScore.strokes[0]).toBe(1);
  expect(game.current_player?.id).toBe(celia.id);
  expect(game.dart_count).toBe(3);
  expect(game.throws.length).toBe(1);
});

test("golfReduce : en cas d'égalité, le premier joueur (dans l'ordre de jeu) est désigné vainqueur", () => {
  const players = [matthieu, celia];

  const matthieuScore = new GolfScore(matthieu);
  matthieuScore.strokes = Array(GOLF_HOLES).fill(2);
  matthieuScore.total = 18;

  const celiaScore = new GolfScore(celia);
  celiaScore.strokes = Array(8).fill(2);
  celiaScore.total = 16;

  let game: Game = {
    ...defaultGame,
    status: Game_State.THROWING,
    players,
    scores: [matthieuScore, celiaScore],
    current_player: celia,
    round: GOLF_HOLES * players.length - 1,
    dart_count: 1,
  };

  // Celia termine son dernier trou avec un simple extérieur (2 coups) -> total 18, égalité avec Matthieu
  game = golfReduce(game, makeThrow(9, Ring.SIMPLE_TOP));

  expect(game.status).toBe(Game_State.WON);
  expect(game.current_player?.id).toBe(matthieu.id);
});
