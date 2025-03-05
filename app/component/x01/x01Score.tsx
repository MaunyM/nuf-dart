'use client'

import React from 'react'
import { Coord } from '../../Type/Math';
import { x01Score } from '@/app/Type/x01';
import "./x01.css"

type ScoreBoardProps = {
  score:x01Score
  }; 

 const angle = Math.PI/10
 const start_angle = -Math.PI/20
 const end_angle = start_angle + angle
 const cos_start = Math.cos(start_angle)
 const sin_start = Math.sin(start_angle)
 const cos_end = Math.cos(end_angle)
 const sin_end = Math.sin(end_angle)
 const start:(r:number) => Coord = (r:number) => ({ x :cos_start * r, y: sin_start * r})
 const end:(r:number) => Coord = (r:number) => ({ x :cos_end * r, y: sin_end * r})

export default function ScoreX01Component(props:ScoreBoardProps){


  return (
    <g transform="" className="x01 score">
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
            {props.score.score}
          </text>
          <text
            x="10"
            y="90"
            dominantBaseline="middle"
            className="text mini"
          >
            Moy : {Math.floor(props.score.average)}
          </text>
        </svg>
      </g>
    </g>
  );
}
