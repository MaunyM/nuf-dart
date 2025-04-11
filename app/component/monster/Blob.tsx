"use client";

import React, { useEffect, useState } from "react";
import "./Monster.css";
import { Joueur } from "@/app/Type/Game";

const colorToMonster: Map<number, string> = new Map([
  [205.9, "lightBlue"],
  [54, "gold"],
  [145.4, "aquamarine"],
  [10, "red"],
  [296, "purple"],
  [300, "pink"],
  [38.8, "orange"],
]);

const min = 1.2
const max = 2

type blobProps = {
  joueur?: Joueur;
};
export default function BlobComponent(props: blobProps) {
  const [color, setColor] = useState<string>("");
  const [duration] = useState<number>(Math.random()* (max-min) + min);

  useEffect(() => {
    if (props.joueur) {
      const blobColor = colorToMonster.get(props.joueur.color.h);
      if (blobColor) {
        setColor(blobColor);
      }
    }
  }, [props.joueur]);

  return (
    <svg width="120" height="140" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <g id="big">
          <rect width="60" height="10" x="30" y="0" fill="var(--strokeColor)" />
          <rect width="60" height="10" x="30" y="10" fill="var(--bodyColor)" />
          <rect width="10" height="10" x="20" y="10" fill="var(--strokeColor)" />
          <rect width="90" height="10" x="10" y="20" fill="var(--bodyColor)" />
          <rect width="10" height="10" x="10" y="20" fill="var(--strokeColor)" />
          <rect width="10" height="60" x="0" y="30" fill="var(--strokeColor)" />
          <rect width="80" height="10" x="20" y="90" fill="var(--bodyColor)" />
          <rect width="100" height="60" x="10" y="30" fill="var(--bodyColor)" />
          <rect width="10" height="10" x="10" y="90" fill="var(--strokeColor)" />
          <rect width="80" height="10" x="20" y="100" fill="var(--strokeColor)" />
          <rect width="10" height="10" x="100" y="90" fill="var(--strokeColor)" />
          <rect width="10" height="60" x="110" y="30" fill="var(--strokeColor)" />
          <rect width="10" height="10" x="100" y="20" fill="var(--strokeColor)" />
          <rect width="10" height="10" x="90" y="10" fill="var(--strokeColor)" />
          <rect width="20" height="10" x="20" y="20" fill="var(--sparklColor)" />
          <rect width="40" height="10" x="10" y="30" fill="var(--sparklColor)" />
          <rect width="20" height="10" x="20" y="40" fill="var(--sparklColor)" />
          <rect width="10" height="20" x="30" y="70" fill="var(--strokeColor)" />
          <rect width="10" height="20" x="80" y="70" fill="var(--strokeColor)" />
          <rect width="10" height="10" x="90" y="80" fill="var(--sparklColor)" />
          <rect width="10" height="10" x="20" y="80" fill="var(--sparklColor)" />
        </g>
        <g id="short">
          <rect width="60" height="10" x="30" y="10" fill="var(--strokeColor)" />
          <rect width="60" height="10" x="30" y="20" fill="var(--bodyColor)" />
          <rect width="10" height="10" x="20" y="20" fill="var(--strokeColor)" />
          <rect width="90" height="10" x="10" y="30" fill="var(--bodyColor)" />
          <rect width="10" height="10" x="10" y="30" fill="var(--strokeColor)" />
          <rect width="10" height="50" x="0" y="40" fill="var(--strokeColor)" />
          <rect width="80" height="10" x="20" y="90" fill="var(--bodyColor)" />
          <rect width="100" height="50" x="10" y="40" fill="var(--bodyColor)" />
          <rect width="10" height="10" x="10" y="90" fill="var(--strokeColor)" />
          <rect width="80" height="10" x="20" y="100" fill="var(--strokeColor)" />
          <rect width="10" height="10" x="100" y="90" fill="var(--strokeColor)" />
          <rect width="10" height="50" x="110" y="40" fill="var(--strokeColor)" />
          <rect width="10" height="10" x="100" y="30" fill="var(--strokeColor)" />
          <rect width="10" height="10" x="90" y="20" fill="var(--strokeColor)" />
          <rect width="20" height="10" x="20" y="30" fill="var(--sparklColor)" />
          <rect width="40" height="10" x="10" y="40" fill="var(--sparklColor)" />
          <rect width="20" height="10" x="20" y="50" fill="var(--sparklColor)" />
          <rect width="10" height="20" x="30" y="70" fill="var(--strokeColor)" />
          <rect width="10" height="20" x="80" y="70" fill="var(--strokeColor)" />
          <rect width="10" height="10" x="90" y="80" fill="var(--sparklColor)" />
          <rect width="10" height="10" x="20" y="80" fill="var(--sparklColor)" />
        </g>
        <g id="shorter">
          <rect width="40" height="10" x="40" y="20" fill="var(--strokeColor)" />
          <rect width="40" height="10" x="40" y="30" fill="var(--bodyColor)" />
          <rect width="10" height="10" x="30" y="30" fill="var(--strokeColor)" />
          <rect width="70" height="10" x="20" y="40" fill="var(--bodyColor)" />
          <rect width="10" height="10" x="20" y="40" fill="var(--strokeColor)" />
          <rect width="10" height="50" x="10" y="50" fill="var(--strokeColor)" />
          <rect width="60" height="10" x="30" y="100" fill="var(--bodyColor)" />
          <rect width="80" height="50" x="20" y="50" fill="var(--bodyColor)" />
          <rect width="10" height="10" x="20" y="100" fill="var(--strokeColor)" />
          <rect width="60" height="10" x="30" y="110" fill="var(--strokeColor)" />
          <rect width="10" height="10" x="90" y="100" fill="var(--strokeColor)" />
          <rect width="10" height="50" x="100" y="50" fill="var(--strokeColor)" />
          <rect width="10" height="10" x="90" y="40" fill="var(--strokeColor)" />
          <rect width="10" height="10" x="80" y="30" fill="var(--strokeColor)" />
          <rect width="20" height="10" x="30" y="40" fill="var(--sparklColor)" />
          <rect width="40" height="10" x="20" y="50" fill="var(--sparklColor)" />
          <rect width="20" height="10" x="30" y="60" fill="var(--sparklColor)" />
          <rect width="10" height="20" x="40" y="80" fill="var(--strokeColor)" />
          <rect width="10" height="20" x="70" y="80" fill="var(--strokeColor)" />
          <rect width="10" height="10" x="80" y="90" fill="var(--sparklColor)" />
          <rect width="10" height="10" x="30" y="90" fill="var(--sparklColor)" />
        </g>
        <g id="mini">
          <rect width="60" height="10" x="30" y="40" fill="var(--strokeColor)" />
          <rect width="60" height="10" x="30" y="50" fill="var(--bodyColor)" />
          <rect width="10" height="10" x="20" y="50" fill="var(--strokeColor)" />
          <rect width="90" height="10" x="20" y="60" fill="var(--bodyColor)" />
          <rect width="10" height="10" x="10" y="60" fill="var(--strokeColor)" />
          <rect width="10" height="30" x="0" y="70" fill="var(--strokeColor)" />
          <rect width="80" height="10" x="20" y="100" fill="var(--bodyColor)" />
          <rect width="100" height="30" x="10" y="70" fill="var(--bodyColor)" />
          <rect width="10" height="10" x="10" y="100" fill="var(--strokeColor)" />
          <rect width="80" height="10" x="20" y="110" fill="var(--strokeColor)" />
          <rect width="10" height="10" x="100" y="100" fill="var(--strokeColor)" />
          <rect width="10" height="30" x="110" y="70" fill="var(--strokeColor)" />
          <rect width="10" height="10" x="100" y="60" fill="var(--strokeColor)" />
          <rect width="10" height="10" x="90" y="50" fill="var(--strokeColor)" />
          <rect width="20" height="10" x="20" y="60" fill="var(--sparklColor)" />
          <rect width="40" height="10" x="10" y="70" fill="var(--sparklColor)" />
          <rect width="20" height="10" x="20" y="80" fill="var(--sparklColor)" />
          <rect width="10" height="10" x="40" y="90" fill="var(--strokeColor)" />
          <rect width="10" height="10" x="70" y="90" fill="var(--strokeColor)" />
          <rect width="10" height="10" x="90" y="90" fill="var(--sparklColor)" />
          <rect width="10" height="10" x="20" y="90" fill="var(--sparklColor)" />
        </g>
        <g id="miniBigEyes">
          <rect width="60" height="10" x="30" y="40" fill="var(--strokeColor)" />
          <rect width="60" height="10" x="30" y="50" fill="var(--bodyColor)" />
          <rect width="10" height="10" x="20" y="50" fill="var(--strokeColor)" />
          <rect width="90" height="10" x="20" y="60" fill="var(--bodyColor)" />
          <rect width="10" height="10" x="10" y="60" fill="var(--strokeColor)" />
          <rect width="10" height="30" x="0" y="70" fill="var(--strokeColor)" />
          <rect width="80" height="10" x="20" y="100" fill="var(--bodyColor)" />
          <rect width="100" height="30" x="10" y="70" fill="var(--bodyColor)" />
          <rect width="10" height="10" x="10" y="100" fill="var(--strokeColor)" />
          <rect width="80" height="10" x="20" y="110" fill="var(--strokeColor)" />
          <rect width="10" height="10" x="100" y="100" fill="var(--strokeColor)" />
          <rect width="10" height="30" x="110" y="70" fill="var(--strokeColor)" />
          <rect width="10" height="10" x="100" y="60" fill="var(--strokeColor)" />
          <rect width="10" height="10" x="90" y="50" fill="var(--strokeColor)" />
          <rect width="20" height="10" x="20" y="60" fill="var(--sparklColor)" />
          <rect width="40" height="10" x="10" y="70" fill="var(--sparklColor)" />
          <rect width="20" height="10" x="20" y="80" fill="var(--sparklColor)" />
          <rect width="20" height="10" x="30" y="90" fill="var(--strokeColor)" />
          <rect width="20" height="10" x="70" y="90" fill="var(--strokeColor)" />
          <rect width="10" height="10" x="90" y="90" fill="var(--sparklColor)" />
          <rect width="10" height="10" x="20" y="90" fill="var(--sparklColor)" />
        </g>
      </defs>
      <svg width="120" height="140" xmlns="http://www.w3.org/2000/svg">
        <g className={color}>
          <g>
            <use href="#big"/>
          </g>
          <g transform="translate(120 10)">
            <use href="#big" />
          </g>
          <g transform="translate(240 00)">
            <use href="#short" />
          </g>
          <g transform="translate(360 10)">
            <use href="#short" />
          </g>
          <g transform="translate(480 10)">
            <use href="#shorter" />
          </g>
          <g transform="translate(600 20)">
            <use href="#shorter" />
          </g>
          <g transform="translate(720 20)">
            <use href="#mini" />
          </g>
          <g transform="translate(840 20)">
            <use href="#mini" />
          </g>
          <g transform="translate(960 20)">
            <use href="#miniBigEyes" />
          </g>
          <g transform="translate(1080 20)">
            <use href="#shorter" />
          </g>
          <g transform="translate(1200 10)">
            <use href="#shorter" />
          </g>
          <g transform="translate(1320 10)">
            <use href="#short" />
          </g>
          <g transform="translate(1440 0)">
            <use href="#short" />
          </g>
          <g transform="translate(1560 0)">
            <use href="#big" />
          </g>
          <g transform="translate(1680 0)">
            <use href="#big" />
          </g>
          <g transform="translate(1800 0)">
            <use href="#big" />
          </g>

          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="translate"
            values="0 0;-120 0;-240 0;-360 0;-480 0;-600 0;-720 0;-840 0;-960 0;-1080 0;-1200 0;-1320 0;-1440 0;-1560 0;-1680 0;-1800 0"
            dur={duration + "s"}
            calcMode="discrete"
            repeatCount="indefinite"
          />
        </g>
      </svg>
    </svg>
  );
}
