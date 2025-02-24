'use client'

import React from 'react'
import './GameButton.css'; 
import { AnimatePresence,motion } from "motion/react";

type GameButtonProps = {
  text: string;
};

export default function GameButtonComponent(props:GameButtonProps){
  return (
    <g className='gameButton'>
    <rect
      className="display_panel go"
      x="0"
      y="0"
      width="200"
      height="60"
      rx="10"
      ry="10"
    />
    <g transform="translate(100,35)">
      <text className="text" dominantBaseline="middle">
        {props.text}
      </text>
    </g>
  </g>
  );
}
