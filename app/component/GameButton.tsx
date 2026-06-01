'use client'

import React from 'react'
import './GameButton.css'; 

type GameButtonProps = {
  text: string;
  size?:number;
  selected?: boolean;
  disabled?: boolean;
};

export default function GameButtonComponent({text, size = 200, selected = false, disabled = false}: GameButtonProps){
  return (
    <g className={`gameButton${selected ? ' selected' : ''}${disabled ? ' disabled' : ''}`}>
    <g transform={`translate(-${size/2} -30)`}>
    <rect
      className="display_panel go"
      x="0"
      y="0"
      width={size}
      height="60"
      rx="10"
      ry="10"
    ></rect>
    </g>
      <text className="text"    dominantBaseline="middle"
            textAnchor="middle">
        {text}
      </text>
  </g>
  );
}
