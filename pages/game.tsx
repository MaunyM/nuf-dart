"use client";
import GameCanvas from "../app/component/Canvas";
import { Game, Game_State, Game_Type, Ring } from "@/app/Type/Game";
import { useEffect, useState } from "react";

type GameProps = {
  game: Game<Game_Type.CRICKET>,
  tapHandler(value:number, ring:Ring): Game<Game_Type.CRICKET>
  ready: () => void;
  startGame: () => void;
  undo: () => void;
  miss: () => void;
};

export default function Home(props: GameProps) {

  const [game, setGame] = useState(props.game);
  const startGame = props.startGame;
  useEffect(() => {
    if (game.status === Game_State.UNSTARTED) startGame();
  }, [game, startGame]);

  useEffect(() => {
   setGame(props.game);
  }, [props.game]);

  return <GameCanvas game={game} tapHandler={props.tapHandler} ready={props.ready} undo={props.undo} miss={props.miss}></GameCanvas>;
}
