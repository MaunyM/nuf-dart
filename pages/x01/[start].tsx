"use client";
import {
  Game,
  Joueur,
} from "@/app/Type/Game";

import _ from "lodash";
import AbstractGame from "../../app/component/abstractGame";
import { x01Reduce } from "@/app/service/x01Service";
import { x01Score } from "@/app/Type/x01";
import { useRouter } from "next/router";

type GameProps = {
  players: Joueur[];
    addPlayers(joueur: Joueur[]): Game;
};

const VALID_STARTS = [301, 501];

export default function Home(props: GameProps) {
  const router = useRouter()
  const startParam = Number(router.query.start);
  const start = VALID_STARTS.includes(startParam) ? startParam : 501;
  return (
    <AbstractGame
    initialScoreFromPlayer={ (joueur: Joueur) => { return new x01Score(joueur, start)}}
    players={props.players}
    gameReducer={x01Reduce}
    addPlayers={props.addPlayers}
    ></AbstractGame>
  );
}
