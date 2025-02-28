'use client'

import React from 'react'
import './GameButton.css'; 

type GameButtonProps = {
  text: string;
};

export default function GameButtonComponent(props:GameButtonProps){
  return (
    <g className='gameButton'>
    <g transform='translate(-100 -30)'>
    <rect
      className="display_panel go"
      x="0"
      y="0"
      width="200"
      height="60"
      rx="10"
      ry="10"
    ></rect>
    </g>
      <text className="text"    dominantBaseline="middle"
            textAnchor="middle">
        {props.text}
      </text>
  </g>
  );
}
