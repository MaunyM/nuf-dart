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


const getLine = (index:number) => ~~(index/4)
const getColumn = (index:number) => index%4

export default function ScoreBoardComponent(props:ScoreBoardProps){


  return (
    <g transform="translate(0,50)">

      {props.players.map((player, index) => (    
        <g key={index} transform={`translate(${170* getColumn(index)},${387 * getLine(index)})`}>
          <PlayerScoreComponent key={index} player={player}></PlayerScoreComponent>
        </g>
      ))}
    </g>
  );
}
