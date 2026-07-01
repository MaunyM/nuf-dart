"use client";
import { Game, Joueur, Team } from "@/app/Type/Game";

import AbstractGame from "../app/component/abstractGame";
import { MonsterReducer } from "@/app/service/monsterService";
import { MonsterScore } from "@/app/Type/Monster";
import { useMemo } from "react";

type GameProps = {
  players: Joueur[];
  addPlayers(joueur: Joueur[]): Game;
  seriesTarget: number;
  teams: Team[];
};

export default function Home(props: GameProps) {
  const monsterReducer = useMemo(
    () => new MonsterReducer(props.players, props.teams),
    [props.players, props.teams]
  );

  return (
    <AbstractGame
      initialScoreFromPlayer={(joueur: Joueur) => {
        const monsterZone = monsterReducer.zones[0];
        return new MonsterScore(
          joueur,
          monsterZone.get(joueur.id),
          monsterReducer.getTeamId(joueur)
        );
      }}
      players={props.players}
      gameReducer={monsterReducer.reduce.bind(monsterReducer)}
      addPlayers={props.addPlayers}
      seriesTarget={props.seriesTarget}
      teams={props.teams}
    />
  );
}
