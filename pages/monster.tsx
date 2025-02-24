"use client";
import {
  Joueur,
} from "@/app/Type/Game";

import _ from "lodash";
import AbstractGame from "../app/component/abstractGame";
import { monsterReduce } from "@/app/service/monsterService";
import { MonsterScore } from "@/app/Type/Monster";

type GameProps = {
  players: Joueur[];
};

export default function Home(props: GameProps) {
  return (
    <AbstractGame
    initialScoreFromPlayer={ (joueur: Joueur) => { return new MonsterScore(joueur)}}
    players={props.players}
    gameReducer={monsterReduce}
    ></AbstractGame>
  );
}
