'use client'

import React from 'react'
import { GolfScore } from '@/app/Type/Golf'
import { GOLF_HOLES } from '@/app/service/golfService'
import "./Golf.css"

type ScoreBoardProps = {
  score: GolfScore
  currentHole: number
};

export default function GolfScoreComponent(props: ScoreBoardProps) {
  return (
    <g transform="" className="golf score">
      <g transform="translate(-50,-20)">
        <svg width="150" height="120">
          <rect x="0" y="0" width="150" height="60" fill="none" />
          <text
            x="50%"
            y="40"
            dominantBaseline="middle"
            textAnchor="middle"
            className="text"
          >
            {props.score.total}
          </text>
          <text
            x="10"
            y="90"
            dominantBaseline="middle"
            className="text mini"
          >
            Trou {props.currentHole}/{GOLF_HOLES}
          </text>
        </svg>
      </g>
    </g>
  );
}
