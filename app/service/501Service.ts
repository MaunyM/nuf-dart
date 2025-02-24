import { _501Score } from "../Type/501";
import { DartThrow, Game, Game_State, mults, Score } from "../Type/Game";
import {
  dartCountReduce,
  firstPlayerReduce,
  gameStatusReduce,
  playerReduce,
  throwReduce,
} from "./commonReduce";
import { getScoreFromPlayer, updatePlayerScore } from "./gameService";

export function score501Reduce(dartThrow: DartThrow, game: Game): Game {
  let newGame = game;
  if (game.current_player) {
    const current_score = getScoreFromPlayer(
      game.scores as Score[],
      game.current_player
    ) as _501Score;
    if (current_score) {
      let score = current_score.score;
      const new_score = score - dartThrow.value * mults[dartThrow.ring];
      if (new_score < 0) {
        newGame = {
          ...newGame,
          dart_count: 1,
        };
      } else {
        newGame = {
          ...newGame,
          scores: updatePlayerScore(
            { ...current_score, score: new_score } as _501Score,
            game.scores
          ),
        };
      }
    }
  }
  return newGame;
}

function winReduce(dartThrow: DartThrow, game: Game): Game {
  if (game.current_player) {
    const current_score = getScoreFromPlayer(
      game.scores as Score[],
      game.current_player
    ) as _501Score;
    if (current_score.score === 0) {
      return { ...game, status: Game_State.WON };
    }
  }
  return { ...game };
}

export function _501Reduce(game: Game, dartThrow: DartThrow): Game {
  let updatedGame = throwReduce(dartThrow, game);
  updatedGame = firstPlayerReduce(dartThrow, updatedGame);
  updatedGame = score501Reduce(dartThrow, updatedGame);
  updatedGame = dartCountReduce(dartThrow, updatedGame);
  updatedGame = gameStatusReduce(dartThrow, updatedGame);
  updatedGame = winReduce(dartThrow, updatedGame);
  updatedGame = playerReduce(dartThrow, updatedGame);
  return updatedGame;
}
