"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import "./Waiting.css";
import { Game, Game_State, Game_Type } from "../Type/Game";
import { AnimatePresence,motion } from "motion/react";

type WaitingProps = {
  game: Game;
  ready: () => void;
};

const MIN_PANEL_WIDTH = 200;
const PANEL_PADDING = 40;

export default function WaitingComponent(props: WaitingProps) {
  const [game, setGame] = useState(props.game);
  const textRef = useRef<SVGTextElement>(null);
  const [panelWidth, setPanelWidth] = useState(MIN_PANEL_WIDTH);

  useEffect(() => {
    setGame(props.game);
  }, [props.game]);

  useLayoutEffect(() => {
    if (textRef.current) {
      const textWidth = textRef.current.getBBox().width;
      setPanelWidth(Math.max(MIN_PANEL_WIDTH, textWidth + PANEL_PADDING));
    }
  }, [game.current_player?.nom, game.status]);

  return (
    <g className="waiting" onClick={() => props.ready()}>
      <AnimatePresence>
        {game.status === Game_State.WAITING_NEXT_PLAYER && (
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
              fill={`url(#grad-${props.game.current_player?.nom})`}
              className="panel"
              x={-panelWidth / 2}
              y="-40"
              width={panelWidth}
              height="80"
              rx="15"
              ry="15"
            />
            <text ref={textRef} className="text" dominantBaseline="middle">
              {game.current_player?.nom}
            </text>
          </motion.g>
        )}
      </AnimatePresence>
    </g>
  );
}
