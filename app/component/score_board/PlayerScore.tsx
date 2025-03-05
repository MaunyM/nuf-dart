'use client'

import React from 'react'
import { Coord } from '../../Type/Math';
import './PlayerScore.css'
import { Game_Type, Score } from '../../Type/Game';
import CricketScoreComponent from '../cricket/CricketScore';
import { CricketScore } from '@/app/Type/Cricket';
import { _501Score } from '@/app/Type/[start]';
import Score501Component from '../501/501Score';
import ScoreMonsterComponent from '../monster/MonsterScore';
import { MonsterScore } from '@/app/Type/Monster';

type ScoreBoardProps= {
  score:Score
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
          fill={`url(#grad-${props.score.joueur.nom})`}
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
            {props.score.joueur.nom}
          </text>
        </svg>
        <text
    dominantBaseline="middle"
    className="text">{}</text>
        <g transform="translate(50,80)">
            {props.score.type === Game_Type.CRICKET && <CricketScoreComponent score={props.score as CricketScore}></CricketScoreComponent>}
            {props.score.type === Game_Type._501 && <Score501Component score={props.score as _501Score}></Score501Component>}
            {props.score.type === Game_Type.MONSTER && <ScoreMonsterComponent score={props.score as MonsterScore}></ScoreMonsterComponent>}
        </g>
      </g>
    </g>
  );
}
