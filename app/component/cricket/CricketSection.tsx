"use client";

import React, { useState } from "react";
import PartComponent from "../Part";
import "./Cricket.css";
import { Game_Type, Joueur, Score } from "@/app/Type/Game";
import { isOpen } from "@/app/service/cricketService";
import { CricketScore } from "@/app/Type/Cricket";

type SectionProps = {
  scores: CricketScore[];
  value: number;
};

const r0 = 180;
const r1 = 170;
const sectionAngle = (2 * Math.PI) / 20;

export default function CricketSectionComponent(props: SectionProps) {
  const [playerCount] = useState(props.scores.length);
  return (
    <g className="CricketSection">
      {props.scores.map((score, index) =>
        score.type === Game_Type.CRICKET && isOpen(score, props.value) ? (
          <g key={index}>
            <g className="back">
              <PartComponent
                r1={r0}
                r2={r1}
                angle={sectionAngle / playerCount}
                shift={(index * sectionAngle) / playerCount}
                gameType={Game_Type.CRICKET}
              ></PartComponent>
            </g>
            <g fill={`url(#grad-${score.joueur.nom}`}>
              <PartComponent
                r1={r0}
                r2={r1}
                angle={sectionAngle / playerCount}
                shift={(index * sectionAngle) / playerCount}
                gameType={Game_Type.CRICKET}
              ></PartComponent>
            </g>
          </g>
        ) : (
          <g key={index} />
        )
      )}
    </g>
  );
}
