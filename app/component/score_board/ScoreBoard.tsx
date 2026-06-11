'use client'

import React from 'react'
import './ScoreBoard.css'
import { Score, Team } from '../../Type/Game';
import { MonsterScore } from '../../Type/Monster';
import PlayerScoreComponent from './PlayerScore';

type ScoreBoardProps = {
  scores: Score[];
  wins: Record<number, number>;
  seriesTarget: number;
  teams?: Team[];
};


const getLine = (index:number) => ~~(index/4)
const getColumn = (index:number) => index%4

export default function ScoreBoardComponent(props:ScoreBoardProps){
  const teams = props.teams;
  const orderedScores = teams && teams.length >= 2
    ? [...props.scores].sort(
        (a, b) => (a as MonsterScore).teamId - (b as MonsterScore).teamId
      )
    : props.scores;

  const teamColorName = (score: Score): string | undefined => {
    if (!teams || teams.length < 2) return undefined;
    const teamId = (score as MonsterScore).teamId;
    return teams.find((team) => team.id === teamId)?.players[0]?.nom;
  };

  return (
    <g transform="translate(0,50)">
      {orderedScores.map((score, index) => (
        <g key={index} transform={`translate(${170* getColumn(index)},${387 * getLine(index)})`}>
          <PlayerScoreComponent key={index} score={score} wins={props.wins[score.joueur.id] || 0} seriesTarget={props.seriesTarget} teamColorName={teamColorName(score)}></PlayerScoreComponent>
        </g>
      ))}
    </g>
  );
}
