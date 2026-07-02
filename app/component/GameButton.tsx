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
  const clipId = `btn-clip-${text}`;
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
        {segments.length > 0 && (
          <>
            <defs>
              <clipPath id={clipId}>
                <rect x="0" y="0" width={size} height="60" rx="10" ry="10" />
              </clipPath>
            </defs>
            <g clipPath={`url(#${clipId})`}>
              {(() => {
                let offsetX = 0;
                return segments.map((seg, i) => {
                  const w = seg.ratio * size;
                  const el = (
                    <rect key={i} x={offsetX} y={0} width={w} height={60} fill={seg.color} opacity={0.9} />
                  );
                  offsetX += w;
                  return el;
                });
              })()}
            </g>
          </>
        )}
      </g>
      <text className="text" dominantBaseline="middle" textAnchor="middle">
        {text}
      </text>
    </g>
  );
}
