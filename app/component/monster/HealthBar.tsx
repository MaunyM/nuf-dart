'use client'

import React from 'react'
import { Coord } from '../../Type/Math';
import { _501Score } from '@/app/Type/501';
import "./Monster.css"
import { MonsterScore } from '@/app/Type/Monster';
import BlobComponent from './Blob';
import { max_health } from '@/app/service/monsterService';

type HealthBarProps = {
  score:number
  }; 


export default function HealthBarComponent(props:HealthBarProps){


  return (
    <g >
      {[...Array(max_health)].map((_, index) => (
          <rect width="50" height="9" y={index * 12} x="0" className={(max_health - index)>props.score?"bar empty":"bar full"} key={index} />
      ))}
    </g>
  );
}
