"use client";
import { Game, Joueur } from "@/app/Type/Game";

import _ from "lodash";
import AbstractGame from "../app/component/abstractGame";
import { applyZoneToMonsterPlayer, MonsterReducer, randomZone } from "@/app/service/monsterService";
import { MonsterJoueur, MonsterScore } from "@/app/Type/Monster";
import { useEffect, useState } from "react";

type GameProps = {
  players: Joueur[];
  addPlayers(joueur: Joueur[]): Game;
};

export default function Home(props: GameProps) {
  const [monsterReducer, setMonsterReducer] = useState(new MonsterReducer());
  const [monsterPlayers, setMonsterPlayer] = useState<MonsterJoueur[]>([]);

  useEffect(() => {
    if (props.players && props.players.length >= 1) {
      const monsterZones = randomZone(props.players, props.players[0]);
      monsterReducer.zones = [monsterZones]
      setMonsterPlayer(applyZoneToMonsterPlayer(props.players, monsterZones))
    }
  }, [props.players, monsterReducer]);

  return (
    <AbstractGame
      initialScoreFromPlayer={(joueur: Joueur) => {
        return new MonsterScore(joueur);
      }}
      players={monsterPlayers}
      gameReducer={monsterReducer.reduce.bind(monsterReducer)}
      addPlayers={props.addPlayers}
    ></AbstractGame>
  );
}
