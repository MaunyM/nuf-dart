import { DartThrow, Game, Game_State } from "../Type/Game";
import { getIndexFromPlayers } from "./gameService";

export function firstPlayerReduce(dartThrow: DartThrow, game: Game): Game {
  if (!game.current_player) {
    return { ...game, current_player: game.players[0] };
  }
  return game;
}

export function throwReduce(
    dartThrow: DartThrow,
    game: Game
  ): Game{
    const throws = [...game.throws, dartThrow];
    return { ...game, throws };
  }

export function gameStatusReduce(dartThrow: DartThrow, game: Game): Game {
  if (game.dart_count == 3) {
    return { ...game, status: Game_State.WAITING_NEXT_PLAYER };
  }
  return { ...game, status: Game_State.THROWING };
}

export function dartCountReduce(dartThrow: DartThrow, game: Game): Game {
  const dart_count = game.dart_count - 1;
  return { ...game, dart_count: dart_count == 0 ? 3 : dart_count };
}

export function playerReduce(
    dartThrow: DartThrow,
    game: Game
  ): Game {
    if (Game_State.WON !== game.status && game.current_player && game.dart_count == 3) {
      let playerIndex =  getIndexFromPlayers(game.current_player, game.players);
      playerIndex = playerIndex + 1 >= game.players.length ? 0 : playerIndex + 1;
      const current_player = game.players[playerIndex];
      return { ...game, current_player };
    } else {
      return { ...game };
    }
  }
