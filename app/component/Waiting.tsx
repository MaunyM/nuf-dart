'use client'

import React, { useEffect, useRef, useState } from 'react'
import './Waiting.css'; 
import { Game, Game_State } from '../Type/Game';
import { AnimatePresence, motion } from 'framer-motion';
import { CricketScore } from '../Type/Cricket';

type WaitingProps = {
  game:Game<CricketScore>
}

export default function WaitingComponent(props:WaitingProps ){
  const [game, setGame] = useState(props.game)
  useEffect(() => {
    setGame(props.game);
  }, [props.game]);
  return (
    <g onClick={() => game.ready()}>


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
              fill={`url(#grad-${props.game.next_player?.nom})`}
              className="panel"
              x="-100"
              y="-40"
              width="200"
              height="80"
              rx="15"
              ry="15"
            />
            <text className="text" dominantBaseline="middle">
              {game.next_player?.nom}
            </text>
          </motion.g>
        )}
      </AnimatePresence>
    </g>
  );
}
