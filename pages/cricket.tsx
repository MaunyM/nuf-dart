"use client";
import {
  Game,
  Joueur,
} from "@/app/Type/Game";

import { cricketReduce } from "@/app/service/cricketService";
import _ from "lodash";
import AbstractGame from "../app/component/abstractGame";
import { CricketScore } from "@/app/Type/Cricket";

type GameProps = {
  players: Joueur[];
    addPlayers(joueur: Joueur[]): Game;
};

export default function Home(props: GameProps) {
  return (
    <AbstractGame
    initialScoreFromPlayer={ (joueur: Joueur) => {   return new CricketScore(joueur)}}
    players={props.players}
    gameReducer={cricketReduce}
    addPlayers={props.addPlayers}
    ></AbstractGame>
  );
}
