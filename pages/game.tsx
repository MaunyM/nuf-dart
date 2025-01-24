"use client";
import GameCanvas from "../app/component/Canvas";
import { Game, Game_State } from "@/app/Type/Game";
import { CricketScore } from "@/app/Type/Cricket";
import { useEffect, useState } from "react";
import { getIndexFromPlayers } from "@/app/service/gameService";
import { isWon } from "@/app/service/cricketService";

type GameProps = {
  game: Game<CricketScore>
};

export default function Home(props: GameProps) {


  const [game, setGame] = useState(props.game);
  useEffect(() => {
    if (game.status === Game_State.UNSTARTED) game.startGame();
  }, [game]);

  return <GameCanvas game={game}></GameCanvas>;
}
