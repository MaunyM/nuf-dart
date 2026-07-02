'use client'

import React from 'react'
import './GameButton.css';

type Segment = { color: string; ratio: number };

type GameButtonProps = {
  text: string;
  size?: number;
  selected?: boolean;
  disabled?: boolean;
  segments?: Segment[];
};

export default function GameButtonComponent({text, size = 200, selected = false, disabled = false, segments = []}: GameButtonProps){
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
        />
        {segments.length > 0 && (() => {
          let offsetX = 0;
          return segments.map((seg, i) => {
            const w = seg.ratio * size;
            const el = (
              <rect
                key={i}
                x={offsetX}
                y={68}
                width={w}
                height={10}
                rx={i === 0 ? 3 : 0}
                ry={i === segments.length - 1 ? 3 : 0}
                fill={seg.color}
                opacity={0.9}
              />
            );
            offsetX += w;
            return el;
          });
        })()}
      </g>
      <text className="text" dominantBaseline="middle" textAnchor="middle">
        {text}
      </text>
    </g>
  );
}
