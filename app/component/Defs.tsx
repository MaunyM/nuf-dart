import React from "react";
import GradientComponent from "./Gradient";
import { Joueur } from "../Type/Game";

type DefProps = {
  players: Joueur[];
};

export default function DefsComponent(props: DefProps) {
  return (
    <>
      {props.players && props.players.map((player, index) => (
        <GradientComponent
          key={index}
          name={`grad-${player.nom}`}
          color={player.color}
        />
      ))}
      <radialGradient id="red_black">
        <stop offset="10%" stopColor="black" />
        <stop offset="95%" stopColor="white" />
      </radialGradient>
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur
          in="SourceGraphic"
          stdDeviation={5}
          result="blurred"
        ></feGaussianBlur>
        <feMerge>ƒ
          <feMergeNode in="blurred" />
          <feMergeNode in="blurred" />
        </feMerge>
      </filter>
      <circle id="bull" cx="0" cy="0" r="32" className="bull" />
      <circle id="bulls_eye" cx="0" cy="0" r="16" className="bulls_eye" />
      <circle id="back" cx="0" cy="0" r="225" className="back" />
    </>
  );
}
