"use client";
import { Game, Joueur } from "@/app/Type/Game";

import _ from "lodash";
import AbstractGame from "../app/component/abstractGame";
import { MonsterReducer } from "@/app/service/monsterService";
import { MonsterScore } from "@/app/Type/Monster";
import { useEffect, useState } from "react";

type GameProps = {
  players: Joueur[];
  addPlayers(joueur: Joueur[]): Game;
};

export default function Home(props: GameProps) {
  const [monsterReducer, setMonsterReducer] = useState<MonsterReducer>();
  useEffect(() => {
    setMonsterReducer(new MonsterReducer(props.players));
  }, [props.players]);

  return (
    <g>
      {monsterReducer && (
        <AbstractGame
          initialScoreFromPlayer={(joueur: Joueur) => {
            const monsterZone = monsterReducer.zones[0];
            return new MonsterScore(joueur, monsterZone.get(joueur.id));
          }}
          players={props.players}
          gameReducer={monsterReducer.reduce.bind(monsterReducer)}
          addPlayers={props.addPlayers}
        ></AbstractGame>
      )}
    </g>
  );
}
