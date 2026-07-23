"use client";
import {
  Game,
  Game_Type,
  Joueur,
} from "@/app/Type/Game";

import { golfReduce } from "@/app/service/golfService";
import AbstractGame from "../app/component/abstractGame";
import { GolfScore } from "@/app/Type/Golf";

type GameProps = {
  players: Joueur[];
  addPlayers(joueur: Joueur[]): Game;
  seriesTarget: number;
};

export default function Home(props: GameProps) {
  return (
    <AbstractGame
    initialScoreFromPlayer={ (joueur: Joueur) => {   return new GolfScore(joueur)}}
    players={props.players}
    gameReducer={golfReduce}
    addPlayers={props.addPlayers}
    seriesTarget={props.seriesTarget}
    gameType={Game_Type.GOLF}
    ></AbstractGame>
  );
}
