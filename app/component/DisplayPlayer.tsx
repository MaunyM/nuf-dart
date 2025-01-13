"use client";

import React, { useEffect, useState } from "react";
import "./DisplayPlayer.css";
import { Game } from "@/app/Type/Game";
import { AnimatePresence,motion } from "motion/react";
import { CricketScore } from "@/app/Type/Cricket";

type DisplayProps = {
  game: Game<CricketScore>;
};

export default function DisplayPlayerComponent(props: DisplayProps) {
  const [game, setGame] = useState(props.game);
  useEffect(() => {
    setGame(props.game);
  }, [props.game]);
  return (
    <g className="display">
      <g transform="translate(-100,-32)">
        <rect
          fill={`url(#grad-${game.current_player?.nom})`}
          className="display_panel"
          x="0"
          y="0"
          width="200"
          height="60"
          rx="10"
          ry="10"
        />
      </g>
      <AnimatePresence>
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            ease: "easeOut",
            duration: 0.5,
          }}
        >
          <text className="text" dominantBaseline="middle">
            {game.current_player?.nom}
          </text>
        </motion.g>
      </AnimatePresence>
    </g>
  );
}
