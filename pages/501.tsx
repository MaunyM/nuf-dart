"use client";
import {
  Game,
  Joueur,
} from "@/app/Type/Game";

import _ from "lodash";
import AbstractGame from "../app/component/abstractGame";
import { _501Reduce } from "@/app/service/501Service";
import { _501Score } from "@/app/Type/501";

type GameProps = {
  players: Joueur[];
    addPlayers(joueur: Joueur[]): Game;
};

export default function Home(props: GameProps) {
  return (
    <AbstractGame
    initialScoreFromPlayer={ (joueur: Joueur) => {   return new _501Score(joueur)}}
    players={props.players}
    gameReducer={_501Reduce}
    addPlayers={props.addPlayers}
    ></AbstractGame>
  );
}
