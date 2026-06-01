"use client";

import React, { useEffect, useState } from "react";
import SectionComponent from "./Section";
import { DartThrow, Game, Game_State, Game_Type, Joueur, Ring, sectionsOrder } from "../Type/Game";
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
import GameButtonComponent from "./GameButton";
import { useRouter } from "next/router";
import { MonsterScore } from "../Type/Monster";

type CanvasProps = {
  game: Game;
  tapHandler(value: number, ring: Ring): Promise<void>;
  ready: () => void;
  undo: () => void;
  miss: () => void;
  newSeries: () => void;
  wins: Record<number, number>;
  seriesWinner?: Joueur;
  seriesTarget: number;
};

function formatThrow(dartThrow: DartThrow): string {
  if (dartThrow.value === 0) return "Miss";
  if (dartThrow.ring === Ring.BULL) return "Bull";
  const prefix = dartThrow.ring === Ring.TRIPLE ? "T" : dartThrow.ring === Ring.DOUBLE ? "D" : "";
  return `${prefix}${dartThrow.value}`;
}

export default function GameCanvas(props: CanvasProps) {
  const router = useRouter();
  const [game, setGame] = useState<Game>(props.game);
  const [wins, setWins] = useState<Record<number, number>>(props.wins);
  const [seriesWinner, setSeriesWinner] = useState<Joueur | undefined>(props.seriesWinner);

  useEffect(() => {
    setGame(props.game);
  }, [props.game]);

  useEffect(() => {
    setWins(props.wins);
  }, [props.wins]);

  useEffect(() => {
    setSeriesWinner(props.seriesWinner);
  }, [props.seriesWinner]);

  const currentTurnThrowCount =
    game.status === Game_State.WAITING_NEXT_PLAYER ? 3 : 3 - game.dart_count;
  const currentTurnThrows =
    currentTurnThrowCount > 0 ? game.throws.slice(-currentTurnThrowCount) : [];

  return (
    <svg
      version="1.1"
      width="1500"
      height="900"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <DefsComponent players={game.players_} />
      </defs>
      <g transform={`translate(900,0)`}>
        <ScoreBoardComponent scores={game.scores} wins={wins} seriesTarget={props.seriesTarget}></ScoreBoardComponent>
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
                player={
                  game.scores[0] && game.scores[0].type === Game_Type.MONSTER
                    ? findJoueurForAttack(
                        game.scores as MonsterScore[],
                        value
                      )?.joueur
                    : undefined
                }
                current_player={game.current_player}
                gameType={game.scores[0] && game.scores[0].type}
              ></SectionComponent>
            </g>
          </g>
        ))}
        <g>
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
        </g>

        <WaitingComponent game={game} ready={props.ready} />

        {!seriesWinner && <WinComponent game={game} ready={props.ready} />}

        {seriesWinner && (
          <g>
            <rect
              fill={`url(#grad-${seriesWinner.nom})`}
              x="-200" y="-60" width="400" height="120" rx="15" ry="15"
            />
            <text className="text" dominantBaseline="middle" y="-18" textAnchor="middle">Champion !</text>
            <text className="text" dominantBaseline="middle" y="28" textAnchor="middle">{seriesWinner.nom}</text>
          </g>
        )}
      </g>
      <g transform="translate(1230,450)">
        <g transform="translate(90,30)">
          {[0, 1, 2].map((i) => {
            const t = currentTurnThrows[i];
            return (
              <g key={i} transform={`translate(${(i - 1) * 90}, 0)`}>
                <rect x="-38" y="-20" width="76" height="40" rx="8" ry="8" className="throw-slot-bg" />
                <text dominantBaseline="middle" textAnchor="middle" className="throw-slot-text">
                  {t ? formatThrow(t) : "—"}
                </text>
              </g>
            );
          })}
        </g>
        <g transform="translate(90,100)" onClick={() => router.push("/")}>
          <GameButtonComponent size={300} text="Retour" />
        </g>
        {seriesWinner && (
          <g transform="translate(90,0)" onClick={props.newSeries}>
            <GameButtonComponent size={300} text="Nouvelle série" />
          </g>
        )}
      </g>
    </svg>
  );
}
