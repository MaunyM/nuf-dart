import { MonsterScore, MonsterZones } from "../Type/Monster";
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
import { updatePlayerScore } from "./gameService";

export const max_health = 10;

function scoreMonsterReduce(dartThrow: DartThrow, game: Game): Game {
  let newGame = game;
  let score = findJoueurForAttack(
    game.scores as MonsterScore[],
    dartThrow.value
  );
  if (score && game.current_player) {
    if (score.joueur.id === game.current_player.id) {
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

function keepAliveReduce(dartThrow: DartThrow, game: Game): Game {
  const scores =  scoreAlive(game.scores as MonsterScore[])
  return { ...game, scores };
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
  scores: MonsterScore[],
  value: number
): MonsterScore | undefined {
  return scores.find(
    (score: MonsterScore) => score.zone && score.zone.includes(value)
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
  scores: MonsterScore[],
  zones: MonsterZones
): MonsterScore[] {
  return scores.map((score) => {
    return { ...score, zone: zones.get(score.joueur.id) } as MonsterScore;
  });
}

function scoreAlive(scores:MonsterScore[]):MonsterScore[] {
  return scores.filter((score:MonsterScore) =>  score.score>0)
}

export class MonsterReducer {
  zones: MonsterZones[] = [];
  reduce(game: Game, dartThrow: DartThrow): Game {
    // Toutes les zones en jeu (soin du joueur courant + zones d'attaque de
    // chaque adversaire) : un lancer y touchant compte comme une réussite,
    // cf. findJoueurForAttack qui recherche sur l'ensemble de game.scores.
    const targetZones = (game.scores as MonsterScore[]).flatMap(
      (score) => score.zone ?? []
    );
    const enrichedThrow: DartThrow = { ...dartThrow, targetZones };

    let updatedGame = throwReduce(enrichedThrow, game);
    updatedGame = firstPlayerReduce(enrichedThrow, updatedGame);
    updatedGame = scoreMonsterReduce(enrichedThrow, updatedGame);
    updatedGame = dartCountReduce(enrichedThrow, updatedGame);
    updatedGame = keepAliveReduce(enrichedThrow, updatedGame);
    updatedGame = gameStatusReduce(enrichedThrow, updatedGame);
    updatedGame = winReduce(enrichedThrow, updatedGame);
    updatedGame = playerReduce(enrichedThrow, updatedGame);

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
        scores: applyZoneToMonsterPlayer(updatedGame.scores as MonsterScore[], current_zones),
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
