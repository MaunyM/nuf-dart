'use client'

import React, { useEffect, useState } from "react";
import './Waiting.css'; 
import { Game, Game_State } from '../Type/Game';
import { AnimatePresence, motion } from 'framer-motion';
import { CricketScore } from '../Type/Cricket';

type WaitingProps = {
  game:Game<CricketScore>
}

export default function WinComponent(props:WaitingProps ){
  const [game, setGame] = useState(props.game)
  useEffect(() => {
    setGame(props.game);
  }, [props.game]);
  return (
    <g onClick={() => game.ready()}>
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
              Victoire de {game.current_player?.nom}
            </text>
          </motion.g>
        )}
      </AnimatePresence>
    </g>
  );
}
