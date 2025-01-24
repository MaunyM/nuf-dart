'use client'

import React, { useState } from 'react'
import PartComponent from '../Part';
import './Cricket.css';
import { JoueurCricket } from '@/app/Type/Game';
import { isOpen } from '@/app/service/cricketService';

type SectionProps = {
    players: JoueurCricket[];
    value: number
  }; 

 const r0 = 180
 const r1 = 170
 const sectionAngle = (2 * Math.PI) / 20

export default function CricketSectionComponent(props: SectionProps) {
  const [playerCount] = useState(props.players.length)
  return (
    <g className='CricketSection'>

            {props.players.map((player, index) =>      
       isOpen(player, props.value) ? <g key={index}> 
             <g  className='back'>
        <PartComponent
          r1={r0}
          r2={r1}
          angle={sectionAngle / playerCount}
          shift={(index*sectionAngle) /playerCount}
        ></PartComponent>
      </g>
       <g fill={`url(#grad-${player.nom}`}>
        <PartComponent
          r1={r0}
          r2={r1}
          angle={sectionAngle / playerCount}
          shift={(index*sectionAngle) /playerCount}
        ></PartComponent>
      </g></g>:<g key={index}/>)}
    </g>
  );
}


