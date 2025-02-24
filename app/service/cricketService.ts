import { CRICKET_ZONES, CricketScore, Marks } from "../Type/Cricket";
import {
  DartThrow,
  Game,
  Game_State,
  Joueur,
  mults,
} from "../Type/Game";
import { dartCountReduce, firstPlayerReduce, gameStatusReduce, playerReduce, throwReduce } from "./commonReduce";
import { getScoreFromPlayer, updatePlayerScore } from "./gameService";


function winReduce(
  dartThrow: DartThrow,
  game: Game
): Game {
  const won = isWon(
    game.current_player as Joueur,
    game.scores as CricketScore[]
  );
  if (won) {
    return { ...game, status: Game_State.WON };
  }
  return { ...game };
}

export function cricketScoreReduce(
  dartThrow: DartThrow,
  game: Game
): Game {
  let newGame = game;
  for (let i = 0; i < mults[dartThrow.ring]; i++) {
    if (game.current_player) {
      const current_score = getScoreFromPlayer(
        game.scores as CricketScore[],
        game.current_player
      ) as CricketScore;
      if (current_score) {
        if (isOpen(current_score, dartThrow.value)) {
          if (
            !isOpenForEveryone(game.scores as CricketScore[], dartThrow.value)
          ) {
            current_score.score += dartThrow.value;
          }
        } else {
          current_score.marks[dartThrow.value] += 1;
        }
        newGame = {
          ...newGame,
          scores: updatePlayerScore(current_score, game.scores),
        };
      }
    }
  }
  return newGame;
}

export function cricketReduce(
  game: Game,
  dartThrow: DartThrow
): Game {
  let updatedGame = throwReduce(dartThrow, game);
  updatedGame = firstPlayerReduce(dartThrow, updatedGame);
  updatedGame = cricketScoreReduce(dartThrow, updatedGame);
  updatedGame = dartCountReduce(dartThrow, updatedGame);
  updatedGame = gameStatusReduce(dartThrow, updatedGame);
  updatedGame = winReduce(dartThrow, updatedGame);
  updatedGame = playerReduce(dartThrow, updatedGame);
  return updatedGame;
}

export function isCricketSection(value: number) {
  return CRICKET_ZONES.includes(value);
}

export function topScorer(scores: CricketScore[]): Joueur {
  return sorteCricketScore(scores)[0].joueur;
}

export function sorteCricketScore(scores: CricketScore[]): CricketScore[] {
  return scores.sort(compareCricketScore);
}

export function compareCricketScore(a: CricketScore, b: CricketScore) {
  return b.score - a.score;
}

export function isOpen(score: CricketScore, value: number): boolean {
  const marks = score.marks;
  return marks[value] === 3;
}

export function startingMarks(): Marks {
  return CRICKET_ZONES.reduce((acc, value) => {
    acc[value] = 0;
    return acc;
  }, {} as Marks);
}

export function isOpenForEveryone(
  scores: CricketScore[],
  value: number
): boolean {
  return scores.every((score) => {
    return isOpen(score, value);
  });
}

export function allOpen(score: CricketScore): boolean {
  return CRICKET_ZONES.every((value) => isOpen(score, value));
}

export function isWon(currentPlayer: Joueur, scores: CricketScore[]) {
  const score: CricketScore | undefined = getScoreFromPlayer(
    scores,
    currentPlayer
  ) as CricketScore;
  return score && topScorer(scores).id == currentPlayer.id && allOpen(score);
}
