import { last, replace } from "lodash";
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
          scores: updatePlayerScore(
            { ...current_score, score: current_score.last_score } as _501Score,
            game.scores
          ),
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

export function lastScoreReduce(
    dartThrow: DartThrow,
    game: Game
  ): Game {
    if (Game_State.WON !== game.status && game.current_player && game.dart_count == 3) {
      const current_score = getScoreFromPlayer(
        game.scores as Score[],
        game.current_player
      ) as _501Score;
      const new_score =  {...current_score, last_score: current_score.score};
      return { ...game, scores:  updatePlayerScore(new_score, game.scores) };
    } else {
      return { ...game };
    }
  }

function volley501Reduce(
    dartThrow: DartThrow,
    game: Game
  ): Game {
    if (Game_State.WON !== game.status && game.current_player) {
      const current_score = getScoreFromPlayer(
        game.scores as Score[],
        game.current_player
      ) as _501Score;
      const volley_score= current_score.volley_score + dartThrow.value * mults[dartThrow.ring]
      let volley_count= current_score.volley_count;
      let average = current_score.average;
      if(game.dart_count == 1) {
        volley_count+= 1;
        average = volley_score/ volley_count;
      }
      const new_score =  {...current_score, volley_score,volley_count,average};
      return { ...game, scores:  updatePlayerScore(new_score, game.scores) };
    } else {
      return { ...game };
    }
  }

export function _501Reduce(game: Game, dartThrow: DartThrow): Game {
  let updatedGame = throwReduce(dartThrow, game);
  updatedGame = firstPlayerReduce(dartThrow, updatedGame);
  updatedGame = score501Reduce(dartThrow, updatedGame);
  updatedGame = volley501Reduce(dartThrow, updatedGame);
  updatedGame = dartCountReduce(dartThrow, updatedGame);
  updatedGame = gameStatusReduce(dartThrow, updatedGame);
  updatedGame = winReduce(dartThrow, updatedGame);
  updatedGame = lastScoreReduce(dartThrow, updatedGame);
  updatedGame = playerReduce(dartThrow, updatedGame);
  return updatedGame;
}
