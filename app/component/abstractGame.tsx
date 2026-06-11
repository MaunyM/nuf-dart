"use client";
import GameCanvas from "./Canvas";
import {
  DartThrow,
  Game,
  Game_State,
  Joueur,
  Ring,
  Score,
} from "@/app/Type/Game";
import { useEffect, useRef, useState } from "react";
import useSound from "use-sound";
import plopSfx from "/public/664624__luis0413__plop-bonk-sound.mp3";
import tululuSfx from "/public/Tululu.mp3";
import nextPlayerSfx from "/public/nextPlayer.mp3";
import doubleSfx from "/public/double.mp3";
import tripleSfx from "/public/triple.mp3";
import { addPlayers, getValidToken, saveGameState } from "@/app/service/gameService";
import { useAuth } from "react-oidc-context";
import _ from "lodash";

type GameProps = {
  players: Joueur[];
  gameReducer: (game: Game, dartThrow: DartThrow) => Game;
  initialScoreFromPlayer: (joueur: Joueur) => Score;
  addPlayers(joueur: Joueur[]): void;
  seriesTarget: number;
};

const initGame: Game = {
  status: Game_State.UNSTARTED,
  throws: [],
  scores: [],
  dart_count: 3,
  players: [],
  round:0
};

export default function AbstractGame({players, addPlayers: addPlayersProps, gameReducer, initialScoreFromPlayer, seriesTarget}: GameProps) {
  const auth = useAuth();
  const [playPlop] = useSound(plopSfx);
  const [playTululu] = useSound(tululuSfx, { volume: 0.1 });
  const [playNextPlayer] = useSound(nextPlayerSfx, { volume: 0.1 });
  const [playDouble] = useSound(doubleSfx, { volume: 0.1 });
  const [playTriple] = useSound(tripleSfx, { volume: 0.1 });
  const [startingGame, setStartingGame] = useState(initGame);
  const [game, setGame] = useState(initGame);
  const [dartThrows, setDartThrows] = useState<DartThrow[]>([]);
  const [wins, setWins] = useState<Record<number, number>>({});
  const [seriesWinner, setSeriesWinner] = useState<Joueur | undefined>();
  const winCountedRef = useRef(false);
  const lastTapRef = useRef<number>(0);

  useEffect(() => {
    if (game.status !== Game_State.WON) {
      winCountedRef.current = false;
      return;
    }
    if (!game.current_player || winCountedRef.current || seriesTarget <= 1) return;
    winCountedRef.current = true;
    const playerId = game.current_player.id;
    const newWins = { ...wins, [playerId]: (wins[playerId] || 0) + 1 };
    const winsNeeded = Math.ceil(seriesTarget / 2);
    setWins(newWins);
    if (newWins[playerId] >= winsNeeded) {
      setSeriesWinner(game.current_player);
    }
  }, [game.status, game.current_player, seriesTarget, wins]);

  const newSeries = function () {
    setWins({});
    setSeriesWinner(undefined);
    const [premier, ...reste] = game.players;
    addPlayersProps([...reste, premier]);
  };

  const ready = function () {
    if (game.current_player) {
      setGame({ ...game, status: Game_State.THROWING });
    }
  };

  const undo = function () {
    setDartThrows(dartThrows.slice(0, -1));
  };

  const miss = function () {
    const now = Date.now();
    if (now - lastTapRef.current < 200) return;
    lastTapRef.current = now;
    if (game.current_player && game.status === Game_State.THROWING) {
      const newThrow: DartThrow = {
        player: game.current_player,
        value: 0,
        ring: Ring.SIMPLE_BOTTOM,
        date: new Date(),
      };
      playTululu();
      setDartThrows([...dartThrows, newThrow]);
    }
  };

  const tapHandler = async function (value: number, ring: Ring) {
    const now = Date.now();
    if (now - lastTapRef.current < 200) return;
    lastTapRef.current = now;
    if (game.current_player && game.status === Game_State.THROWING) {
      const newThrow: DartThrow = {
        player: game.current_player,
        value,
        ring,
        date: new Date(),
      };

      playPlop();
      if (ring === Ring.DOUBLE) playDouble();
      if (ring === Ring.TRIPLE) playTriple();
      setDartThrows([...dartThrows, newThrow]);
    }
  };

  useEffect(() => {
    const newGame = dartThrows.reduce(gameReducer, _.cloneDeep(startingGame));
    setGame(newGame);
    getValidToken(auth).then((token) => {
      if (token) saveGameState(newGame, token);
    });
  }, [dartThrows, startingGame, gameReducer, auth]);

  useEffect(() => {
    if (game.status === Game_State.WAITING_NEXT_PLAYER) {
      playNextPlayer();
    }
  }, [game, playNextPlayer]);

  useEffect(() => {
    if (game.status === Game_State.UNSTARTED)
      setGame({
        ...startingGame,
        current_player: startingGame.players[0],
        status: Game_State.WAITING_NEXT_PLAYER,
      });
  }, [game, startingGame]);

  useEffect(() => {
    const joueurs = players;
    const scores: Score[] = joueurs.map(
     initialScoreFromPlayer
    );

    setDartThrows([]);
    setStartingGame(
      addPlayers(joueurs, {
        ...initGame,
        scores,
        status: Game_State.THROWING,
        current_player: joueurs[0],
      })
    );
  }, [players, initialScoreFromPlayer]);

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
    ></GameCanvas>
  );
}
