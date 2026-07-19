import React from "react";
import GradientComponent from "./Gradient";
import { Joueur, sectionsOrder } from "../Type/Game";

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
      <linearGradient id="wireMetal" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8a8a8a" />
        <stop offset="45%" stopColor="#f7f7f7" />
        <stop offset="55%" stopColor="#f7f7f7" />
        <stop offset="100%" stopColor="#6b6b6b" />
      </linearGradient>
      {sectionsOrder.map((_, index) => (
        <linearGradient
          key={`wireMetal-${index}`}
          id={`wireMetal-${index}`}
          gradientUnits="userSpaceOnUse"
          gradientTransform={`rotate(${-(360 / sectionsOrder.length) * index})`}
          x1="-180"
          y1="-180"
          x2="180"
          y2="180"
        >
          <stop offset="0%" stopColor="#8a8a8a" />
          <stop offset="45%" stopColor="#f7f7f7" />
          <stop offset="55%" stopColor="#f7f7f7" />
          <stop offset="100%" stopColor="#6b6b6b" />
        </linearGradient>
      ))}
      <filter id="wireOutline" x="-50%" y="-50%" width="200%" height="200%">
        <feMorphology in="SourceAlpha" operator="dilate" radius="0.5" result="dilated" />
        <feFlood floodColor="#000000" floodOpacity="0.6" result="flood" />
        <feComposite in="flood" in2="dilated" operator="in" result="outline" />
        <feMerge>
          <feMergeNode in="outline" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
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
