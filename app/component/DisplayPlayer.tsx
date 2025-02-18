"use client";

import React from "react";
import "./DisplayPlayer.css";
import { AnimatePresence,motion } from "motion/react";
import { Joueur } from "../Type/Game";

type DisplayProps = {
  player:Joueur;
};

export default function DisplayPlayerComponent(props: DisplayProps) {
  return (
    <g className="display">
            <AnimatePresence>
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            ease: "easeOut",
            duration: 0.5,
          }}>
      <g transform="translate(-100,-32)">
        <rect
          filter="url(#glow)"
          fill={`url(#grad-${props.player?.nom})`}
          className="display_panel"
          x="0"
          y="0"
          width="200"
          height="60"
          rx="10"
          ry="10"
        />
      </g>
          <text className="text" dominantBaseline="middle">
            {props.player?.nom}
          </text>
        </motion.g>
      </AnimatePresence>
    </g>
  );
}
