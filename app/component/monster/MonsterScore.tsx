'use client'

import React from 'react'
import { Coord } from '../../Type/Math';
import { _501Score } from '@/app/Type/501';
import "./Monster.css"
import { MonsterScore } from '@/app/Type/Monster';

type ScoreBoardProps = {
  score:MonsterScore
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

export default function ScoreMonsterComponent(props:ScoreBoardProps){


  return (
    <g transform="" className="Monster score">
      <g transform="translate(-50,-20)">
        <svg width="150" height="70">
          <rect x="0" y="0" width="150" height="60" fill="none" />
          <text
            x="50%"
            y="50%"
            dominantBaseline="middle"
            textAnchor="middle"
            className="text"
          >
            {props.score.score}
          </text>
        </svg>
      </g>
    </g>
  );
}
