"use client";
import GameCanvas from "./Canvas";
import {
  DartThrow,
  Game,
  Game_State,
  Joueur,
  Ring,
  Score,
  Team,
} from "@/app/Type/Game";
import { useEffect, useLayoutEffect, useReducer, useRef } from "react";
import useSound from "use-sound";
const plopSfx = "/664624__luis0413__plop-bonk-sound.mp3";
const tululuSfx = "/Tululu.mp3";
const nextPlayerSfx = "/nextPlayer.mp3";
const doubleSfx = "/double.mp3";
const tripleSfx = "/triple.mp3";
import { addPlayers, getValidToken, restoreGame, saveGameState } from "@/app/service/gameService";
import { reportGameEnd } from "@/app/service/eloService";
import { Game_Type } from "@/app/Type/Game";
import { useAuth } from "react-oidc-context";
import _ from "lodash";

type GameProps = {
  players: Joueur[];
  gameReducer: (game: Game, dartThrow: DartThrow) => Game;
  initialScoreFromPlayer: (joueur: Joueur) => Score;
  addPlayers(joueur: Joueur[]): void;
  seriesTarget: number;
  gameType: Game_Type;
  teams?: Team[];
};

const initGame: Game = {
  status: Game_State.UNSTARTED,
  throws: [],
  scores: [],
  dart_count: 3,
  players: [],
  round:0
};

type AbstractGameState = {
  dartThrows: DartThrow[];
  startingGame: Game;
  game: Game;
  wins: Record<number, number>;
  seriesWinner: Joueur | undefined;
};

type AbstractGameAction =
  | { type: 'ADD_THROW'; throw: DartThrow; seriesTarget: number; gameReducer: (g: Game, t: DartThrow) => Game }
  | { type: 'UNDO'; gameReducer: (g: Game, t: DartThrow) => Game }
  | { type: 'READY' }
  | { type: 'RESET_PLAYERS'; startingGame: Game }
  | { type: 'RESTORE'; restored: Game }
  | { type: 'NEW_SERIES' };

const initialState: AbstractGameState = {
  dartThrows: [],
  startingGame: initGame,
  game: initGame,
  wins: {},
  seriesWinner: undefined,
};

function abstractGameReducer(state: AbstractGameState, action: AbstractGameAction): AbstractGameState {
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
      return { ...state, wins: {}, seriesWinner: undefined };
  }
}

export default function AbstractGame({ players, addPlayers: addPlayersProps, gameReducer, initialScoreFromPlayer, seriesTarget, gameType, teams }: GameProps) {
  const auth = useAuth();
  const [playPlop] = useSound(plopSfx);
  const [playTululu] = useSound(tululuSfx, { volume: 0.1 });
  const [playNextPlayer] = useSound(nextPlayerSfx, { volume: 0.1 });
  const [playDouble] = useSound(doubleSfx, { volume: 0.1 });
  const [playTriple] = useSound(tripleSfx, { volume: 0.1 });
  const [state, dispatch] = useReducer(abstractGameReducer, initialState);
  const { game, wins, seriesWinner } = state;
  const lastTapRef = useRef<number>(0);

  const initialScoreFromPlayerRef = useRef(initialScoreFromPlayer);
  const teamsRef = useRef(teams);
  useLayoutEffect(() => {
    initialScoreFromPlayerRef.current = initialScoreFromPlayer;
    teamsRef.current = teams;
  });

  useEffect(() => {
    getValidToken(auth).then((token) => {
      if (token) saveGameState(game, token);
    });
  }, [game, auth]);

  useEffect(() => {
    if (game.status !== Game_State.WON || !game.current_player) return;
    getValidToken(auth).then((token) => {
      if (!token) return;
      const winner = game.current_player!;
      const others = game.players.filter((p) => p.id !== winner.id);
      const rankedPlayerIds = [winner.id.toString(), ...others.map((p) => p.id.toString())];
      reportGameEnd(rankedPlayerIds, gameType, token);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.status]);

  useEffect(() => {
    if (game.status === Game_State.WAITING_NEXT_PLAYER) {
      playNextPlayer();
    }
  }, [game, playNextPlayer]);

  useEffect(() => {
    const scores: Score[] = players.map(initialScoreFromPlayerRef.current);
    dispatch({
      type: 'RESET_PLAYERS',
      startingGame: addPlayers(players, {
        ...initGame,
        scores,
        status: Game_State.THROWING,
        current_player: players[0],
        teams: teamsRef.current,
      }),
    });
  }, [players]);

  useEffect(() => {
    restoreGame().then((restored) => {
      if (!restored) return;
      const samePlayers =
        restored.players.length === players.length &&
        restored.players.every((p, i) => p.id === players[i]?.id);
      if (!samePlayers) return;
      dispatch({ type: 'RESTORE', restored });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const newSeries = () => {
    dispatch({ type: 'NEW_SERIES' });
    const [premier, ...reste] = game.players;
    addPlayersProps([...reste, premier]);
  };

  const ready = () => {
    dispatch({ type: 'READY' });
  };

  const undo = () => {
    dispatch({ type: 'UNDO', gameReducer });
  };

  const miss = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 200) return;
    lastTapRef.current = now;
    if (game.current_player && game.status === Game_State.THROWING) {
      playTululu();
      dispatch({
        type: 'ADD_THROW',
        throw: { player: game.current_player, value: 0, ring: Ring.SIMPLE_BOTTOM, date: new Date() },
        seriesTarget,
        gameReducer,
      });
    }
  };

  const tapHandler = async (value: number, ring: Ring) => {
    const now = Date.now();
    if (now - lastTapRef.current < 200) return;
    lastTapRef.current = now;
    if (game.current_player && game.status === Game_State.THROWING) {
      playPlop();
      if (ring === Ring.DOUBLE) playDouble();
      if (ring === Ring.TRIPLE) playTriple();
      dispatch({
        type: 'ADD_THROW',
        throw: { player: game.current_player, value, ring, date: new Date() },
        seriesTarget,
        gameReducer,
      });
    }
  };

  return (
    <GameCanvas
      game={game}
      tapHandler={tapHandler}
      ready={ready}
      undo={undo}
      miss={miss}
      newSeries={newSeries}
      wins={wins}
      seriesWinner={seriesWinner}
      seriesTarget={seriesTarget}
    />
  );
}
