"use client";

import React from "react";
import "./Number.css";

type NumberProps = {
  value: number;
  neonFilterId?: string;
};

export default function NumberComponent(props: NumberProps) {
  return (
    <foreignObject x="-30" y="-30" width="60" height="60">
      <p
        className="test"
        style={props.neonFilterId ? { filter: `url(#${props.neonFilterId})` } : undefined}
      >
        {props.value}
      </p>
    </foreignObject>
  );
}
