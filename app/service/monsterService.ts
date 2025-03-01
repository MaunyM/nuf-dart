import { MonsterJoueur, MonsterScore, MonsterZones } from "../Type/Monster";
import {
  DartThrow,
  Game,
  Game_State,
  Joueur,
  sectionsOrder,
} from "../Type/Game";
import {
  dartCountReduce,
  firstPlayerReduce,
  gameStatusReduce,
  playerReduce,
  throwReduce,
} from "./commonReduce";
import _ from "lodash";
import { getScoreFromPlayer, updatePlayerScore } from "./gameService";
import { M } from "vitest/dist/chunks/environment.d8YfPkTm.js";

export const max_health = 10;

function scoreMonsterReduce(dartThrow: DartThrow, game: Game): Game {
  let newGame = game;
  let touchedPlayer = findJoueurForAttack(
    game.players as MonsterJoueur[],
    dartThrow.value
  );
  if (touchedPlayer && game.current_player) {
    let score: MonsterScore = getScoreFromPlayer(
      game.scores,
      touchedPlayer
    ) as MonsterScore;
    if (touchedPlayer.id === game.current_player.id) {
      if (score.score < max_health) {
        score = { ...score, score: score.score + 1 };
      }
    } else {
      if (score.score > 0) {
        score = { ...score, score: score.score - 1 };
      }
    }
    newGame = { ...newGame, scores: updatePlayerScore(score, game.scores) };
  }
  return newGame;
}

function winReduce(dartThrow: DartThrow, game: Game): Game {
  const won = isWon(game.scores as MonsterScore[]);
  if (won) {
    return { ...game, status: Game_State.WON };
  }
  return { ...game };
}

function countAlive(scores: MonsterScore[]): number {
  return scores.reduce(
    (count, score) => (score.score !== 0 ? count + 1 : count),
    0
  );
}

export function isWon(scores: MonsterScore[]) {
  return countAlive(scores) === 1;
}

export function findJoueurForAttack(
  joueurs: MonsterJoueur[],
  value: number
): Joueur | undefined {
  return joueurs.find(
    (joueur: MonsterJoueur) => joueur.zone && joueur.zone.includes(value)
  );
}

export function randomZone(
  players: Joueur[],
  currentPlayer: Joueur
): MonsterZones {
  let shuffleSection = _.shuffle(sectionsOrder);
  let a1, a2, a3, heal;
  return players.reduce((acc: MonsterZones, player: Joueur) => {
    if (player.id === currentPlayer.id) {
      [heal, ...shuffleSection] = shuffleSection;
      acc.set(player.id, [heal]);
    } else {
      [a1, a2, a3, ...shuffleSection] = shuffleSection;
      acc.set(player.id, [a1, a2, a3]);
    }
    return acc;
  }, new Map<number, number[]>());
}

export function applyZoneToMonsterPlayer(
  players: Joueur[],
  zones: MonsterZones
): MonsterJoueur[] {
  return players.map((joueur) => {
    return { ...joueur, zone: zones.get(joueur.id) } as MonsterJoueur;
  });
}

function playerAlive(scores:MonsterScore[]):Joueur[] {
  return scores.filter((score:MonsterScore) =>  score.score>0).map((score:MonsterScore) => score.joueur)
}

export class MonsterReducer {
  zones: MonsterZones[] = [];
  reduce(game: Game, dartThrow: DartThrow): Game {
    let updatedGame = throwReduce(dartThrow, game);
    updatedGame = firstPlayerReduce(dartThrow, updatedGame);
    updatedGame = scoreMonsterReduce(dartThrow, updatedGame);
    updatedGame = dartCountReduce(dartThrow, updatedGame);
    updatedGame = gameStatusReduce(dartThrow, updatedGame);
    updatedGame = winReduce(dartThrow, updatedGame);
    updatedGame = playerReduce(dartThrow, updatedGame);

    if (
      Game_State.WON !== updatedGame.status &&
      updatedGame.current_player &&
      updatedGame.dart_count == 3
    ) {
      let current_zones = this.zones[updatedGame.round];
      if (!current_zones) {
        (current_zones = randomZone(game.players, updatedGame.current_player)),
          (this.zones = [...this.zones, current_zones]);
      }
      return {
        ...updatedGame,
        players: applyZoneToMonsterPlayer(playerAlive(updatedGame.scores as MonsterScore[]), current_zones),
      };
    }
    return updatedGame;
  }

  constructor(players?: Joueur[]) {
    if (players && players.length >= 1) {
      this.zones = [randomZone(players, players[0])];
    }
  }
}
