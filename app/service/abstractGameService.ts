import _ from "lodash";
import { DartThrow, Game, Game_State, Joueur } from "../Type/Game";

export type AbstractGameState = {
  dartThrows: DartThrow[];
  startingGame: Game;
  game: Game;
  wins: Record<number, number>;
  seriesWinner: Joueur | undefined;
};

export type AbstractGameAction =
  | { type: 'ADD_THROW'; throw: DartThrow; seriesTarget: number; gameReducer: (g: Game, t: DartThrow) => Game }
  | { type: 'UNDO'; gameReducer: (g: Game, t: DartThrow) => Game }
  | { type: 'READY' }
  | { type: 'RESET_PLAYERS'; startingGame: Game }
  | { type: 'RESTORE'; restored: Game }
  | { type: 'NEW_SERIES'; startingGame: Game };

const emptyGame: Game = {
  status: Game_State.UNSTARTED,
  throws: [],
  scores: [],
  dart_count: 3,
  players: [],
  round: 0,
};

export const initialAbstractGameState: AbstractGameState = {
  dartThrows: [],
  startingGame: emptyGame,
  game: emptyGame,
  wins: {},
  seriesWinner: undefined,
};

export function abstractGameReducer(state: AbstractGameState, action: AbstractGameAction): AbstractGameState {
  switch (action.type) {
    case 'ADD_THROW': {
      const newThrows = [...state.dartThrows, action.throw];
      const newGame = newThrows.reduce(action.gameReducer, _.cloneDeep(state.startingGame));
      let { wins, seriesWinner } = state;
      if (newGame.status === Game_State.WON && newGame.current_player && action.seriesTarget > 1) {
        const pid = newGame.current_player.id;
        const newWins = { ...wins, [pid]: (wins[pid] || 0) + 1 };
        wins = newWins;
        if (newWins[pid] >= Math.ceil(action.seriesTarget / 2)) {
          seriesWinner = newGame.current_player;
        }
      }
      return { ...state, dartThrows: newThrows, game: newGame, wins, seriesWinner };
    }
    case 'UNDO': {
      const newThrows = state.dartThrows.slice(0, -1);
      const newGame = newThrows.reduce(action.gameReducer, _.cloneDeep(state.startingGame));
      return { ...state, dartThrows: newThrows, game: newGame };
    }
    case 'READY':
      if (!state.game.current_player) return state;
      return { ...state, game: { ...state.game, status: Game_State.THROWING } };
    case 'RESET_PLAYERS':
      return { ...state, dartThrows: [], startingGame: action.startingGame, game: action.startingGame };
    case 'RESTORE':
      return { ...state, dartThrows: action.restored.throws, game: action.restored };
    case 'NEW_SERIES':
      return {
        ...state,
        dartThrows: [],
        startingGame: action.startingGame,
        game: action.startingGame,
        wins: {},
        seriesWinner: undefined,
      };
  }
}
