"use client";
import {
  Game,
  Game_Type,
  Joueur,
} from "@/app/Type/Game";

import { cricketReduce } from "@/app/service/cricketService";
import _ from "lodash";
import AbstractGame from "../app/component/abstractGame";
import { CricketScore } from "@/app/Type/Cricket";

type GameProps = {
  players: Joueur[];
  addPlayers(joueur: Joueur[]): Game;
  seriesTarget: number;
};

export default function Home(props: GameProps) {
  return (
    <AbstractGame
    initialScoreFromPlayer={ (joueur: Joueur) => {   return new CricketScore(joueur)}}
    players={props.players}
    gameReducer={cricketReduce}
    addPlayers={props.addPlayers}
    seriesTarget={props.seriesTarget}
    gameType={Game_Type.CRICKET}
    ></AbstractGame>
  );
}
