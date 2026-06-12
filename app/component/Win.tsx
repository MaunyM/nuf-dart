"use client";

import React, { useEffect, useState } from "react";
import "./Waiting.css";
import { Game, Game_State, Game_Type } from "../Type/Game";
import { AnimatePresence,motion } from "motion/react";
import { MonsterScore } from "../Type/Monster";
import { useRouter } from "next/router";

type WaitingProps = {
  game: Game;
  ready: () => void;
};

export default function WinComponent(props: WaitingProps) {
  const [game, setGame] = useState(props.game);
  const router = useRouter();
  useEffect(() => {
    setGame(props.game);
  }, [props.game]);

  const winningTeammates =
    game.scores[0]?.type === Game_Type.MONSTER && game.current_player
      ? (game.scores as MonsterScore[]).filter(
          (score) =>
            score.teamId ===
            (game.scores as MonsterScore[]).find(
              (s) => s.joueur.id === game.current_player?.id
            )?.teamId
        )
      : [];
  const winLabel =
    winningTeammates.length > 1
      ? `Victoire de l'équipe : ${winningTeammates.map((s) => s.joueur.nom).join(" & ")}`
      : `Victoire de ${game.current_player?.nom}`;

  return (
    <g className="waiting">
      <AnimatePresence>
        {game.status === Game_State.WON && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              ease: "easeOut",
              duration: 0.5,
            }}
          >
            <rect
              fill={`url(#grad-${game.current_player?.nom})`}
              className="panel"
              x="-200"
              y="-40"
              width="400"
              height="80"
              rx="15"
              ry="15"
            />
            <text className="text" dominantBaseline="middle">
              {winLabel}
            </text>
          </motion.g>
        )}
      </AnimatePresence>
    </g>
  );
}
