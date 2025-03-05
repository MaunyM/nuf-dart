"use client";
import {
  Game,
  Joueur,
} from "@/app/Type/Game";

import _ from "lodash";
import AbstractGame from "../../app/component/abstractGame";
import { _501Reduce } from "@/app/service/501Service";
import { x01Score } from "@/app/Type/x01";
import { useRouter } from "next/router";

type GameProps = {
  players: Joueur[];
    addPlayers(joueur: Joueur[]): Game;
};

export default function Home(props: GameProps) {
  const router = useRouter()
  return (
    <AbstractGame
    initialScoreFromPlayer={ (joueur: Joueur) => {   return new x01Score(joueur,Number(router.query.start))}}
    players={props.players}
    gameReducer={_501Reduce}
    addPlayers={props.addPlayers}
    ></AbstractGame>
  );
}
