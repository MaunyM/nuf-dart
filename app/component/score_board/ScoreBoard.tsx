'use client'

import React from 'react'
import { Coord } from '../../Type/Math';
import './ScoreBoard.css'
import { Joueur } from '../../Type/Game';
import PlayerScoreComponent from './PlayerScore';
import { CricketScore } from '@/app/Type/Cricket';

type ScoreBoardProps = {
  players: Joueur<CricketScore>[];
}; 

 const angle = Math.PI/10
 const start_angle = -Math.PI/20
 const end_angle = start_angle + angle
 const cos_start = Math.cos(start_angle);
 const sin_start = Math.sin(start_angle)
 const cos_end = Math.cos(end_angle)
 const sin_end = Math.sin(end_angle)
 const start:(r:number) => Coord = (r:number) => ({ x :cos_start * r, y: sin_start * r})
 const end:(r:number) => Coord = (r:number) => ({ x :cos_end * r, y: sin_end * r})

export default function ScoreBoardComponent(props:ScoreBoardProps){


  return (
    <g transform="translate(0,50)">

      {props.players.map((player, index) => (
        <g key={index} transform={`translate(${index * 170})`}>
          <PlayerScoreComponent key={index} player={player}></PlayerScoreComponent>
        </g>
      ))}
    </g>
  );
}
