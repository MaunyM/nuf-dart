"use client";

import React from "react";
import PartComponent from "./Part";
import { Game_Type, Joueur, Ring } from "../Type/Game";
import BlobComponent from "./monster/Blob";
import PotionComponent from "./monster/Potion";

type SectionProps = {
  value: number;
  tapHandler: (value: number, ring: Ring) => void;
  player?: Joueur;
  current_player?: Joueur;
  gameType: Game_Type;
  isTarget?: boolean;
  isGolfHole?: boolean;
  golfBalls?: { joueur: Joueur; stroke: number; angleOffset: number }[];
};

const thickness = 16;
const r1 = 170;
const r2 = r1 - thickness;
const r3 = 107;
const r4 = r3 - thickness;
const r5 = 32;
const section_count = 20;
const sectionAngle = (2 * Math.PI) / section_count;

const ballRadiusForStroke: Record<number, number> = {
  1: (r1 + r2) / 2,
  2: (r2 + r3) / 2,
  3: (r3 + r4) / 2,
  4: (r4 + r5) / 2,
};

export default function SectionComponent(props: SectionProps) {
  const isGolfTarget = props.isTarget && props.gameType === Game_Type.GOLF;
  const isGolfHole = props.isGolfHole && props.gameType === Game_Type.GOLF;
  const neonStyle: React.CSSProperties | undefined = props.player
    ? { filter: `url(#neon-${props.player.nom})` }
    : isGolfTarget
    ? { filter: `url(#neon-golf-target)` }
    : props.isTarget && props.current_player
    ? { filter: `url(#neon-${props.current_player.nom})` }
    : undefined;
  const golfFill = isGolfHole ? "#3f9142" : undefined;
  return (
    <g>
      <g
        onClick={() => {
          props.tapHandler(props.value, Ring.DOUBLE);
        }}
      >
        <g className="part1" style={neonStyle}>
          <PartComponent
            r1={r1}
            r2={r2}
            angle={sectionAngle}
            shift={0}
            joueur={props.player}
            gameType={props.gameType}
            fillOverride={golfFill}
          ></PartComponent>
        </g>
        {isGolfHole && (
          <circle cx={(r1 + r2) / 2} cy={0} r={6} fill="#1a1a1a" stroke="#000" strokeWidth={1} />
        )}
      </g>
      <g
        onClick={() => {
          props.tapHandler(props.value, Ring.SIMPLE_TOP);
        }}
        className="part2"
        style={neonStyle}
      >
        <PartComponent
          r1={r2}
          r2={r3}
          angle={sectionAngle}
          shift={0}
          joueur={props.player}
          gameType={props.gameType}
          fillOverride={golfFill}
        ></PartComponent>
      </g>
      <g
        onClick={() => {
          props.tapHandler(props.value, Ring.TRIPLE);
        }}
        className="part3"
        style={neonStyle}
      >
        <PartComponent
          r1={r3}
          r2={r4}
          angle={sectionAngle}
          shift={0}
          joueur={props.player}
          gameType={props.gameType}
          fillOverride={golfFill}
        ></PartComponent>
      </g>
      <g
        onClick={() => {
          props.tapHandler(props.value, Ring.SIMPLE_BOTTOM);
        }}
        className="part4"
        style={neonStyle}
      >
        <PartComponent
          r1={r4}
          r2={r5}
          angle={(2 * Math.PI) / section_count}
          shift={0}
          joueur={props.player}
          gameType={props.gameType}
          fillOverride={golfFill}
        ></PartComponent>
      </g>
      {props.player &&
        props.current_player &&
        props.player.id !== props.current_player.id && (
          <g
            transform="scale(0.2) translate(680 -60) rotate(90 0 0)"
            onClick={() => {
              props.tapHandler(props.value, Ring.SIMPLE_BOTTOM);
            }}
          >
            <BlobComponent joueur={props.player}></BlobComponent>
          </g>
        )}
      {props.player &&
        props.current_player &&
        props.player.id === props.current_player.id && (
          <g
            transform="scale(0.15) translate(885 -70) rotate(90 0 0)  "
            onClick={() => {
              props.tapHandler(props.value, Ring.SIMPLE_BOTTOM);
            }}
          >
            <PotionComponent></PotionComponent>
          </g>
        )}
      {props.golfBalls?.map((ball) => {
        const radius = ballRadiusForStroke[ball.stroke];
        const angle = ball.angleOffset;
        return (
          <circle
            key={ball.joueur.id}
            cx={radius * Math.cos(angle)}
            cy={radius * Math.sin(angle)}
            r={4}
            fill={`url(#grad-${ball.joueur.nom})`}
            stroke="#fff"
            strokeWidth={1}
          />
        );
      })}
    </g>
  );
}
