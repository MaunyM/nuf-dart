'use client'

import React from 'react'
import PartComponent from '../Part';
import './Cricket.css';

type SectionProps = {
  }; 

 const r0 = 180
 const r1 = 170
 const sectionAngle = (2 * Math.PI) / 20

export default function CricketSectionComponent(props: SectionProps) {
  return (
    <g className='CricketSection'>
      <g  className='back'>
        <PartComponent
          r1={r0}
          r2={r1}
          angle={sectionAngle}
          shift={0}
        ></PartComponent>
      </g>
      <g fill={`url(#grad-Matthieu`}>
        <PartComponent
          r1={r0}
          r2={r1}
          angle={sectionAngle / 3}
          shift={0}
        ></PartComponent>
      </g>
      <g fill={`url(#grad-Célia`}>
        <PartComponent
          r1={r0}
          r2={r1}
          angle={sectionAngle / 3}
          shift={sectionAngle / 3}
        ></PartComponent>
      </g>
      <g fill={`url(#grad-Patate`}>
        <PartComponent
          r1={r0}
          r2={r1}
          angle={sectionAngle / 3}
          shift={(2 * sectionAngle) / 3}
        ></PartComponent>
      </g>
    </g>
  );
}


