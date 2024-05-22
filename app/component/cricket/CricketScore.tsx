'use client'

import React, { useEffect, useState } from 'react'
import { Coord } from '../../Type/Math';
import './Cricket.css';
import { motion } from 'framer-motion';
import { CRICKET_ZONES, CricketScore } from '@/app/Type/Cricket';

type ScoreBoardProps = {
  score:CricketScore
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

export default function ScoreComponent(props:ScoreBoardProps){


  return (
    <g transform="" className="score">
      <g transform="translate(-50,-30)">
        <svg width="150" height="50">
          <rect x="0" y="0" width="150" height="60" fill="none" />
          <text
            x="50%"
            y="50%"
            dominantBaseline="middle"
            textAnchor="middle"
            className="text"
          >
            {props.score.score}
          </text>
        </svg>
      </g>
      {CRICKET_ZONES.map((value, index) => (
        <g key={index} transform={`translate(0,${35 + index * 35})`}>
          <text
            dominantBaseline="middle"
            className="text"
          >{`${value} : `}</text>
          <g className="mark" transform="translate(46,-3)">
            <g transform="rotate(45) translate (-17,-2)">
              {props.score.marks[value] >= 1 && (
                <motion.g
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    ease: "easeInOut",
                    duration: 0.5,
                  }}
                >
                  <rect x={0} y={0} width={34} height={4}></rect>
                </motion.g>
              )}
            </g>
            {props.score.marks[value] >= 2 && (
              <g transform="rotate(-45)  translate (-17,-2)">
                                <motion.g
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    ease: "easeInOut",
                    duration: 0.5,
                  }}
                >
                <rect x={0} y={0} width={34} height={4}></rect>
                </motion.g>
              </g>
            )}
            {props.score.marks[value] >= 3 && (
                                              <motion.g
                                              initial={{ opacity: 0 }}
                                              animate={{ opacity: 1 }}
                                              exit={{ opacity: 0 }}
                                              transition={{
                                                ease: "easeInOut",
                                                duration: 0.5,
                                              }}
                                            >
              <circle r={12} strokeWidth="4" fill="none"></circle>
              </motion.g>
            )}
          </g>
        </g>
      ))}
    </g>
  );
}
