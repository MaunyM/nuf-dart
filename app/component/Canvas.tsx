'use client'

import React, {  useEffect, useState } from "react";
import SectionComponent from './Section';
import { Game, Ring } from '../Type/Game';
import NumberComponent from "./Number";
import './Canvas.css';
import WaitingComponent from "./Waiting";
import DisplayComponent from "./Display";
import ScoreBoardComponent from "./score_board/ScoreBoard";
import DefsComponent from "./Defs";
import DartsComponent from "./darts/Darts";
import WinComponent from "./Win";
import { CricketScore } from "../Type/Cricket";
import useSound from "use-sound";
import plopSfx from '/public/664624__luis0413__plop-bonk-sound.mp3'
import CricketSectionComponent from "./cricket/CricketSection";
import { isCricketSection } from "../service/cricketService";

type CanvasProps = {
  game: Game<CricketScore>;
}; 

export default function Canvas(props:CanvasProps){
    const [game, setGame] = useState<Game<CricketScore>>(props.game)
    const [play] = useSound(plopSfx);

    useEffect(() => {setGame(props.game)}, [props.game])

  return (
    <svg
      version="1.1"
      width="1500"
      height="800"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <DefsComponent players={game.players} />
      </defs>
      <g transform={`translate(900,0)`}>
        <ScoreBoardComponent players={game.players}></ScoreBoardComponent>
      </g>
      <g transform={`translate(70,650)`}>
        {game.current_player && <DartsComponent player={game.current_player} />}
      </g>
      <g transform={`translate(110,48)`}>
        <DisplayComponent game={game}></DisplayComponent>
      </g>
      <g transform={`translate(431,361) scale(1.5 1.5)`}>
        <use xlinkHref="#back" />
        <circle
          id="back"
          cx="0"
          cy="0"
          r="170"
          className="under"
          fill="url(#red_black)"
        />
        {game.sectionsOrder.map((value: number, index: number) => (
          <g key={index} className={index % 2 ? "odd" : "even"}>
            <g transform={`rotate(${18 * index})`}>
              {isCricketSection(value) && (
                <CricketSectionComponent></CricketSectionComponent>
              )}
              <SectionComponent
                tapHandler={game.tapHandler.bind(game)}
                value={value}
              ></SectionComponent>
            </g>
           <g

             transform={`translate(${
                +Math.cos((Math.PI / 10) * index) * 195
              } ${Math.sin((Math.PI / 10) * index) * 195}) `} >
            
              <NumberComponent value={value}></NumberComponent>
            </g>
          </g>
        ))}
        <circle cx="0" cy="0" r="7" className="bulls_eye" />
        <use
          xlinkHref="#bull"
          onClick={() => {
            play();
            game.tapHandler(25, Ring.BULL);
          }}
        />
        <use
          xlinkHref="#bulls_eye"
          onClick={() => {
            play();
            game.tapHandler(25, Ring.DOUBLE);
          }}
        />

        <WaitingComponent game={game} />
        <WinComponent game={game} />
      </g>
    </svg>
  );
}

