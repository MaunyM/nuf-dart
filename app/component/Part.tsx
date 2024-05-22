'use client'

import React, { useState } from 'react'
import { Coord } from '../Type/Math';
import './Part.css'

type PartProps = {
      r1: number
      r2: number
      angle: number
      shift: number
  }; 



export default function PartComponent(props:PartProps){

  const start_angle = -Math.PI / 20 + props.shift;
  const end_angle = start_angle + props.angle
  const cos_start = Math.cos(start_angle);
  const sin_start = Math.sin(start_angle)
  const cos_end = Math.cos(end_angle)
  const sin_end = Math.sin(end_angle)

  const start:(r:number) => Coord = (r:number) => ({ x :cos_start * r, y: sin_start * r})
  const end:(r:number) => Coord = (r:number) => ({ x :cos_end * r, y: sin_end * r})
  const [r1_start] = useState<Coord>(start(props.r1))
  const [r1_end] = useState<Coord>(end(props.r1))
  const [r2_start] = useState<Coord>(start(props.r2))
  const [r2_end] = useState<Coord>(end(props.r2))

  return (
    <g> 
      <path className='part'
        d={`M ${r1_start.x} ${r1_start.y} A ${props.r1} ${props.r1} 0 0 1 ${r1_end.x} ${r1_end.y} 
        L ${r2_end.x} ${r2_end.y} A ${props.r2} ${props.r2} 0 0 0 ${r2_start.x} ${r2_start.y} L ${r1_start.x} ${r1_start.y} `}

      />
    </g>
  );
}
