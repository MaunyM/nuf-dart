import React from "react";
import { Color } from "../Type/Math";

type GradientProps = {
  name: string;
  color: Color;
};

export default function GradientComponent(props: GradientProps) {
  return (
    <linearGradient
      id={`${props.name}`}
      x1="0%"
      y1="0%"
      x2="100%"
      y2="0%"
      gradientTransform="rotate(65)"
    >
      <stop
        offset="30%"
        stopColor={`hsl(${props.color.h},${props.color.s}%,${props.color.l}%)`}
        stopOpacity="0.8"
      />
      <stop
        offset="100%"
        stopColor={`hsl(${props.color.h},${props.color.s}%,${
          props.color.l + 10
        }%)`}
        stopOpacity="0.9"
      />
    </linearGradient>
  );
}
