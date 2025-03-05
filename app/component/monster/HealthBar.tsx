'use client'

import React from 'react'
import "./Monster.css"
import { max_health } from '@/app/service/monsterService';

type HealthBarProps = {
  score:number
  }; 

export default function HealthBarComponent(props:HealthBarProps){
  return (
    <g >
      {[...Array(max_health)].map((_, index) => (
          <rect width="50" height="20" y={index * 23} x="0" className={(max_health - index)>props.score?"bar empty":"bar full"} key={index} />
      ))}
    </g>
  );
}
