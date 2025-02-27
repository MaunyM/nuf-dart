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
};

const thickness = 16;
const r1 = 170;
const r2 = r1 - thickness;
const r3 = 107;
const r4 = r3 - thickness;
const r5 = 32;
const section_count = 20;
const sectionAngle = (2 * Math.PI) / section_count;

export default function SectionComponent(props: SectionProps) {
  return (
    <g>
      <g
        onClick={() => {
          props.tapHandler(props.value, Ring.DOUBLE);
        }}
        className="part1"
      >
        <PartComponent
          r1={r1}
          r2={r2}
          angle={sectionAngle}
          shift={0}
          joueur={props.player}
          gameType={props.gameType}
        ></PartComponent>
      </g>
      <g
        onClick={() => {
          props.tapHandler(props.value, Ring.SIMPLE_TOP);
        }}
        className="part2"
      >
        <PartComponent
          r1={r2}
          r2={r3}
          angle={sectionAngle}
          shift={0}
          joueur={props.player}
          gameType={props.gameType}
        ></PartComponent>
      </g>
      <g
        onClick={() => {
          props.tapHandler(props.value, Ring.TRIPLE);
        }}
        className="part3"
      >
        <PartComponent
          r1={r3}
          r2={r4}
          angle={sectionAngle}
          shift={0}
          joueur={props.player}
          gameType={props.gameType}
        ></PartComponent>
      </g>
      <g
        onClick={() => {
          props.tapHandler(props.value, Ring.SIMPLE_BOTTOM);
        }}
        className="part4"
      >
        <PartComponent
          r1={r4}
          r2={r5}
          angle={(2 * Math.PI) / section_count}
          shift={0}
          joueur={props.player}
          gameType={props.gameType}
        ></PartComponent>
      </g>
      {props.player &&
        props.current_player &&
        props.player.id !== props.current_player.id && (
          <g transform="scale(0.2) translate(680 -60) rotate(90 0 0)  ">
            <BlobComponent joueur={props.player}></BlobComponent>
          </g>
        )}
            {props.player &&
        props.current_player &&
        props.player.id === props.current_player.id && (
          <g transform="scale(0.15) translate(885 -70) rotate(90 0 0)  ">
            <PotionComponent></PotionComponent>
          </g>
        )}
    </g>
  );
}
