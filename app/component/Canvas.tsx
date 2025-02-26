"use client";

import React, { useEffect, useState } from "react";
import SectionComponent from "./Section";
import { Game, Game_State, Game_Type, Ring, sectionsOrder } from "../Type/Game";
import NumberComponent from "./Number";
import "./Canvas.css";
import WaitingComponent from "./Waiting";
import DisplayComponent from "./DisplayPlayer";
import ScoreBoardComponent from "./score_board/ScoreBoard";
import DefsComponent from "./Defs";
import DartsComponent from "./darts/Darts";
import WinComponent from "./Win";
import CricketSectionComponent from "./cricket/CricketSection";
import { isCricketSection } from "../service/cricketService";
import { CricketScore } from "../Type/Cricket";
import TextComponent from "./TextButton";
import { findJoueurForAttack } from "../service/monsterService";
import { MonsterJoueur, MonsterScore } from "../Type/Monster";

type CanvasProps = {
  game: Game;
  tapHandler(value: number, ring: Ring): Promise<void>;
  ready: () => void;
  undo: () => void;
  miss: () => void;
};

export default function GameCanvas(props: CanvasProps) {
  const [game, setGame] = useState<Game>(props.game);

  useEffect(() => {
    setGame(props.game);
  }, [props.game]);

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
        <ScoreBoardComponent scores={game.scores}></ScoreBoardComponent>
      </g>
      <g transform={`translate(710,18)`}>
        {game.current_player && <DartsComponent dart_count={game.dart_count} />}
      </g>
      <g transform={`translate(710,730)`}>
        <TextComponent undo={props.undo} text="Annuler"></TextComponent>
      </g>
      <g transform={`translate(70,730)`}>
        <TextComponent undo={props.miss} text="Miss"></TextComponent>
      </g>
      <g transform={`translate(110,48)`}>
        {game.current_player && game.status == Game_State.THROWING && (
          <DisplayComponent player={game.current_player}></DisplayComponent>
        )}
      </g>
      <g transform={`translate(410,400) scale(1.7 1.7)`}>
        <use xlinkHref="#back" />
        <circle
          id="back"
          cx="0"
          cy="0"
          r="170"
          className="under"
          fill="url(#red_black)"
        />
        {sectionsOrder.map((value: number, index: number) => (
          <g key={index} className={index % 2 ? "odd" : "even"}>
            <g
              suppressHydrationWarning={true}
              transform={`translate(${
                +Math.cos((Math.PI / (sectionsOrder.length / 2)) * index) * 195
              } ${
                Math.sin((Math.PI / (sectionsOrder.length / 2)) * index) * 195
              }) `}
            >
              <NumberComponent value={value}></NumberComponent>
            </g>
            <g transform={`rotate(${(360 / sectionsOrder.length) * index})`}>
              {isCricketSection(value) && (
                <CricketSectionComponent
                  scores={game.scores as CricketScore[]}
                  value={value}
                ></CricketSectionComponent>
              )}
              <SectionComponent
                tapHandler={props.tapHandler}
                value={value}
                joueur={game.scores[0] && game.scores[0].type === Game_Type.MONSTER ? findJoueurForAttack(game.players as MonsterJoueur[], value) : undefined}
              ></SectionComponent>
            </g>
          </g>
        ))}
        <circle cx="0" cy="0" r="7" className="bulls_eye" />
        <use
          xlinkHref="#bull"
          onClick={async () => {
            await props.tapHandler(25, Ring.BULL);
          }}
        />
        <use
          xlinkHref="#bulls_eye"
          onClick={() => {
            props.tapHandler(25, Ring.DOUBLE);
          }}
        />

        <WaitingComponent game={game} ready={props.ready} />

        <WinComponent game={game} ready={props.ready} />
      </g>
    </svg>
  );
}
