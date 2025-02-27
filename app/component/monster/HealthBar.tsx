'use client'

import React from 'react'
import { Coord } from '../../Type/Math';
import { _501Score } from '@/app/Type/501';
import "./Monster.css"
import { MonsterScore } from '@/app/Type/Monster';
import BlobComponent from './Blob';

type HealthBarProps = {
  score:number
  }; 

 const max_health = 20;

export default function HealthBarComponent(props:HealthBarProps){


  return (
    <g >
      {[...Array(max_health)].map((_, index) => (
          <rect width="10" height="30" x={index * 13} y="0" className={index<props.score?"bar full":"bar empty"} key={index} />
      ))}
    </g>
  );
}
