'use client'

import React from 'react'
import "./Monster.css"
import { max_health } from '@/app/service/monsterService';

type HealthBarProps = {
  score:number
  maxScore?: number
  };

export default function HealthBarComponent(props:HealthBarProps){
  const maxScore = props.maxScore ?? max_health;
  const segmentHeight = 23 * (max_health / maxScore);
  return (
    <g >
      {[...Array(maxScore)].map((_, index) => (
          <rect width="50" height={segmentHeight - 3} y={index * segmentHeight} x="0" className={(maxScore - index)>props.score?"bar empty":"bar full"} key={index} />
      ))}
    </g>
  );
}
