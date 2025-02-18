'use client'

import React from 'react'
import './TextButton.css'; 
import { AnimatePresence,motion } from "motion/react";

type MissProps = {
  undo: () => void;
  text: string;
};

export default function TextComponent(props:MissProps){
  return (
    <g onClick={() => props.undo()}>
      <rect
        className="dispaly_panel"
        x="-60"
        y="0"
        width="160"
        height="50"
        rx="10"
        ry="10"
      />
      <AnimatePresence>
            <g transform={`translate(22,35)`} >
              <text className='text'>{props.text}</text>
            </g>
      </AnimatePresence>
    </g>
  );
}
