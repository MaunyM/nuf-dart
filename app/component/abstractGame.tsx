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
import { useEffect, useState } from "react";
import useSound from "use-sound";
import plopSfx from "/public/664624__luis0413__plop-bonk-sound.mp3";
import tululuSfx from "/public/Tululu.mp3";
import nextPlayerSfx from "/public/nextPlayer.mp3";
import doubleSfx from "/public/double.mp3";
import tripleSfx from "/public/triple.mp3";
import { addPlayers, delay } from "@/app/service/gameService";
import _ from "lodash";

type GameProps = {
  players: Joueur[];
  gameReducer: (game: Game, dartThrow: DartThrow) => Game;
  initialScoreFromPlayer: (joueur: Joueur) => Score;
  addPlayers(joueur: Joueur[]): void;
};

const initGame: Game = {
  status: Game_State.UNSTARTED,
  throws: [],
  scores: [],
  dart_count: 3,
  players_: [],
  round:0
};

export default function AbstractGame({players, addPlayers: addPlayersProps,gameReducer, initialScoreFromPlayer}: GameProps) {
  const [playPlop] = useSound(plopSfx);
  const [playTululu] = useSound(tululuSfx, { volume: 0.1 });
  const [playNextPlayer] = useSound(nextPlayerSfx, { volume: 0.1 });
  const [playDouble] = useSound(doubleSfx, { volume: 0.1 });
  const [playTriple] = useSound(tripleSfx, { volume: 0.1 });
  const [startingGame, setStartingGame] = useState(initGame);
  const [game, setGame] = useState(initGame);
  const [dartThrows, setDartThrows] = useState<DartThrow[]>([]);

  const ready = function () {
    if (game.current_player) {
      setGame({ ...game, status: Game_State.THROWING });
    }
  };

  const undo = function () {
    setDartThrows(dartThrows.slice(0, -1));
  };

  const miss = async function () {
    if (game.current_player && game.status === Game_State.THROWING) {
      const newThrow: DartThrow = {
        player: game.current_player,
        value: 0,
        ring: Ring.SIMPLE_BOTTOM,
        date: new Date(),
      };
      playTululu();
      await delay(1000);
      setDartThrows([...dartThrows, newThrow]);
    }
  };

  const tapHandler = async function (value: number, ring: Ring) {
    if (game.current_player && game.status === Game_State.THROWING) {
      const newThrow: DartThrow = {
        player: game.current_player,
        value,
        ring,
        date: new Date(),
      };

      playPlop();
      if (ring === Ring.DOUBLE) {
        playDouble();
        await delay(1000);
      }
      if (ring === Ring.TRIPLE) {
        playTriple();
        await delay(1000);
      }
      setDartThrows([...dartThrows, newThrow]);
    }
  };

  useEffect(() => {
    const newGame = dartThrows.reduce(gameReducer, _.cloneDeep(startingGame));
    setGame(newGame);
  }, [dartThrows, startingGame, gameReducer]);

  useEffect(() => {
    if (game.status === Game_State.WAITING_NEXT_PLAYER) {
      playNextPlayer();
    }
  }, [game, playNextPlayer]);

  useEffect(() => {
    if (game.status === Game_State.UNSTARTED)
      setGame({
        ...startingGame,
        current_player: startingGame.players_[0],
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
      setPlayers={addPlayersProps}
    ></GameCanvas>
  );
}
