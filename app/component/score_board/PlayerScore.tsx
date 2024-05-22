'use client'

import React, { useEffect, useState } from 'react'
import { Coord } from '../../Type/Math';
import './PlayerScore.css'
import { Joueur } from '../../Type/Game';
import ScoreComponent from '../cricket/CricketScore';
import { CricketScore } from '@/app/Type/Cricket';

type ScoreBoardProps = {
  player:Joueur<CricketScore>
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

export default function PlayerScoreComponent(props:ScoreBoardProps){


  return (
    <g transform="" className="score">
      <g transform="translate(-80,-27)">
        <rect
          fill={`url(#grad-${props.player.nom})`}
          className="score_board"
          x="0"
          y="0"
          width="150"
          height="360"
          rx="10"
          ry="10"
        />
        <svg width="150px" height="70px">
          <text x="50%" y="50%" dominantBaseline="middle" className="text">
            {props.player.nom}
          </text>
        </svg>
        <text
    dominantBaseline="middle"
    className="text">{}</text>
        <g transform="translate(50,80)">
            <ScoreComponent score={props.player.score as CricketScore}></ScoreComponent>
        </g>
      </g>
    </g>
  );
}
