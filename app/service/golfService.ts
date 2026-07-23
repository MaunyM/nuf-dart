import { GolfScore } from "../Type/Golf";
import { DartThrow, Game, Game_State, Joueur, Ring } from "../Type/Game";
import {
  dartCountReduce,
  firstPlayerReduce,
  gameStatusReduce,
  playerReduce,
  throwReduce,
} from "./commonReduce";
import { getScoreFromPlayer, updatePlayerScore } from "./gameService";

export const GOLF_HOLES = 9;

export function holeTarget(holeIndex: number): number {
  return holeIndex + 1;
}

export function currentHoleIndex(game: Game): number {
  return Math.floor(game.round / game.players.length);
}

export function strokesForDart(dartThrow: DartThrow, target: number): number {
  if (dartThrow.value !== target) return 5;
  switch (dartThrow.ring) {
    case Ring.DOUBLE:
      return 1;
    case Ring.SIMPLE_TOP:
      return 2;
    case Ring.TRIPLE:
      return 3;
    case Ring.SIMPLE_BOTTOM:
      return 4;
    default:
      return 5;
  }
}

export function totalStrokes(score: GolfScore): number {
  return score.strokes.reduce((sum: number, s) => sum + (s ?? 0), 0);
}

export function scoreGolfReduce(dartThrow: DartThrow, game: Game): Game {
  // Un arrêt anticipé ne rejoue pas de fléchette : le score du trou est déjà
  // celui fixé par la dernière fléchette réellement lancée.
  if (dartThrow.stopTurn) return game;
  if (!game.current_player) return game;
  const current_score = getScoreFromPlayer(
    game.scores as GolfScore[],
    game.current_player
  ) as GolfScore;
  if (!current_score) return game;
  const target = holeTarget(currentHoleIndex(game));
  const strokes = [...current_score.strokes];
  strokes[currentHoleIndex(game)] = strokesForDart(dartThrow, target);
  const new_score = { ...current_score, strokes } as GolfScore;
  new_score.total = totalStrokes(new_score);
  return { ...game, scores: updatePlayerScore(new_score, game.scores) };
}

// Un arrêt anticipé ne doit pas apparaître dans l'historique des lancers
// affiché à l'écran (il ne correspond à aucune fléchette réelle).
function golfThrowReduce(dartThrow: DartThrow, game: Game): Game {
  if (dartThrow.stopTurn) return game;
  return throwReduce(dartThrow, game);
}

// Force la fin du tour : même mécanisme que le bust du X01 (dart_count=1
// juste avant dartCountReduce, qui le fait retomber à 3 quel que soit le
// nombre de fléchettes réellement lancées ce tour-ci).
function stopTurnReduce(dartThrow: DartThrow, game: Game): Game {
  if (dartThrow.stopTurn) {
    return { ...game, dart_count: 1 };
  }
  return game;
}

function winnerOf(scores: GolfScore[]): Joueur {
  return scores.reduce((best, s) => (s.total < best.total ? s : best), scores[0])
    .joueur;
}

function winGolfReduce(dartThrow: DartThrow, game: Game): Game {
  if (
    Game_State.WON !== game.status &&
    game.dart_count === 3 &&
    game.round === GOLF_HOLES * game.players.length - 1
  ) {
    const winner = winnerOf(game.scores as GolfScore[]);
    return { ...game, status: Game_State.WON, current_player: winner };
  }
  return { ...game };
}

export function golfReduce(game: Game, dartThrow: DartThrow): Game {
  let updatedGame = golfThrowReduce(dartThrow, game);
  updatedGame = firstPlayerReduce(dartThrow, updatedGame);
  updatedGame = scoreGolfReduce(dartThrow, updatedGame);
  updatedGame = stopTurnReduce(dartThrow, updatedGame);
  updatedGame = dartCountReduce(dartThrow, updatedGame);
  updatedGame = gameStatusReduce(dartThrow, updatedGame);
  updatedGame = winGolfReduce(dartThrow, updatedGame);
  updatedGame = playerReduce(dartThrow, updatedGame);
  return updatedGame;
}
