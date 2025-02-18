import {
  Game,
  Game_State,
  Game_Type,
} from "../Type/Game";

export const defaultCricketGame: Game<Game_Type.CRICKET> = {
  throws: [],
  status: Game_State.CHOOSE_PLAYER,
  dart_count: 3,
  scores: [],
  players: [],
};
