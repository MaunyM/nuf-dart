import { MonsterScore } from "../Type/Monster";
import {
  DartThrow,
  Game,
  Game_State,
  Joueur,
  mults,
  Score,
  sectionsOrder,
} from "../Type/Game";
import {
  dartCountReduce,
  firstPlayerReduce,
  gameStatusReduce,
  playerReduce,
  throwReduce,
} from "./commonReduce";

import _, { isFunction } from "lodash";

function scoreMonsterReduce(dartThrow: DartThrow, game: Game): Game {
  let newGame = game;
  return newGame;
}

function winReduce(dartThrow: DartThrow, game: Game): Game {
  return { ...game };
}

function zoneReduce(dartThrow: DartThrow, game: Game): Game {
  let shuffleSection = _.shuffle(sectionsOrder);
  let a1, a2, a3, heal;
  if (game.dart_count === 3) {
    const new_scores = (game.scores as MonsterScore[]).map(
      (score: MonsterScore) => {
        if (game.current_player && score.joueur.id === game.current_player.id) {
          [heal, ...shuffleSection] = shuffleSection;
          return { ...score, heal: [heal], attack: [] };
        } else {
          [a1, a2, a3, ...shuffleSection] = shuffleSection;
          return { ...score, attack: [a1, a2, a3], heal: [] };
        }
      }
    );
    return { ...game, scores: new_scores };
  } 
  return game
}

export function monsterReduce(game: Game, dartThrow: DartThrow): Game {
  let updatedGame = throwReduce(dartThrow, game);
  updatedGame = firstPlayerReduce(dartThrow, updatedGame);
  updatedGame = scoreMonsterReduce(dartThrow, updatedGame);
  updatedGame = dartCountReduce(dartThrow, updatedGame);
  updatedGame = gameStatusReduce(dartThrow, updatedGame);
  updatedGame = winReduce(dartThrow, updatedGame);
  updatedGame = playerReduce(dartThrow, updatedGame);
  updatedGame = zoneReduce(dartThrow, updatedGame);
  return updatedGame;
}
