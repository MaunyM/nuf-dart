'use client'

import React from 'react'
import './Dart.css'; 
import { AnimatePresence,motion } from "motion/react";
import DartComponent from './Dart';
import { Joueur } from '@/app/Type/Game';
import { CricketScore } from '@/app/Type/Cricket';

type DartsProps = {
  player: Joueur<CricketScore>
}

export default function DartsComponent(props:DartsProps){
  return (
    <g>
      <rect
        fill={`url(#grad-${props.player.nom})`}
        className="dispaly_panel"
        x="-60"
        y="0"
        width="130"
        height="50"
        rx="10"
        ry="10"
      />
      <AnimatePresence>
        {[...Array(props.player?.dart_count)].map((e, i) => (
          <motion.g
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              ease: "easeOut",
              duration: 0.5,
            }}
          >
            <g transform={`translate(${30 * i},0)`}>
              <DartComponent />
            </g>
          </motion.g>
        ))}
      </AnimatePresence>
    </g>
  );
}
