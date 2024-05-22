"use client";

import React from "react";
import PartComponent from "./Part";
import { Ring } from "../Type/Game";
import useSound from "use-sound";
import plopSfx from "/public/664624__luis0413__plop-bonk-sound.mp3";
import CricketSectionComponent from "./cricket/CricketSection";
import { CRICKET_ZONES } from "../Type/Cricket";

type SectionProps = {
  value: number;
  tapHandler: (value: number, ring: Ring) => void;
};

const thickness = 8;
const r1 = 170;
const r2 = r1 - thickness;
const r3 = 107;
const r4 = r3 - thickness;
const r5 = 16;
const sectionAngle = (2 * Math.PI) / 20;

export default function SectionComponent(props: SectionProps) {
  const [play] = useSound(plopSfx);
  return (
    <g>
      <g
        onClick={() => {
          play();
          props.tapHandler(props.value, Ring.DOUBLE);
        }}
        className="part1"
      >
        <PartComponent
          r1={r1}
          r2={r2}
          angle={sectionAngle}
          shift={0}
        ></PartComponent>
      </g>
      <g
        onClick={() => {
          play();
          props.tapHandler(props.value, Ring.SIMPLE_TOP);
        }}
        className="part2"
      >
        <PartComponent
          r1={r2}
          r2={r3}
          angle={sectionAngle}
          shift={0}
        ></PartComponent>
      </g>
      <g
        onClick={() => {
          play();
          props.tapHandler(props.value, Ring.TRIPLE);
        }}
        className="part3"
      >
        <PartComponent
          r1={r3}
          r2={r4}
          angle={sectionAngle}
          shift={0}
        ></PartComponent>
      </g>
      <g
        onClick={() => {
          play();
          props.tapHandler(props.value, Ring.SIMPLE_BOTTOM);
        }}
        className="part4"
      >
        <PartComponent
          r1={r4}
          r2={r5}
          angle={(2 * Math.PI) / 20}
          shift={0}
        ></PartComponent>
      </g>
    </g>
  );
}
