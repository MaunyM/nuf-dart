"use client";

import React from "react";
import PartComponent from "./Part";
import { Ring } from "../Type/Game";


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
        ></PartComponent>
      </g>
    </g>
  );
}
