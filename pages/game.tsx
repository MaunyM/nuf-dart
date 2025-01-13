'use client'
import { useEffect, useState } from "react";
import Canvas from "../app/component/Canvas";
import { Game, Game_State } from "@/app/Type/Game";
import { CricketScore } from "@/app/Type/Cricket";

type GameProps = {
  game: Game<CricketScore>;
};

export default function Home(props: GameProps) {

  return (
    <Canvas game={props.game}></Canvas>
  );
}
