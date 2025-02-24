import {
  Game,
  Game_State,
} from "../Type/Game";

export const defaultGame: Game= {
  throws: [],
  status: Game_State.CHOOSE_PLAYER,
  dart_count: 3,
  scores: [],
  players: [],
};
