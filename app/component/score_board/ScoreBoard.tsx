'use client'

import React from 'react'
import './ScoreBoard.css'
import { Game_Type, Joueur, Score } from '../../Type/Game';
import PlayerScoreComponent from './PlayerScore';

type ScoreBoardProps = {
  scores: Score<Game_Type.CRICKET>[];
}; 


const getLine = (index:number) => ~~(index/4)
const getColumn = (index:number) => index%4

export default function ScoreBoardComponent(props:ScoreBoardProps){


  return (
    <g transform="translate(0,50)">

      {props.scores.map((score, index) => (    
        <g key={index} transform={`translate(${170* getColumn(index)},${387 * getLine(index)})`}>
          <PlayerScoreComponent key={index} score={score}></PlayerScoreComponent>
        </g>
      ))}
    </g>
  );
}
