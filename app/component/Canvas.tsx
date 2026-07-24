"use client";

import React from "react";
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
import { currentHoleIndex, holeTarget } from "../service/golfService";
import { GolfScore } from "../Type/Golf";
import PerformanceChartComponent from "./performance/PerformanceChart";

type CanvasProps = {
  game: Game;
  tapHandler(value: number, ring: Ring): Promise<void>;
  ready: () => void;
  undo: () => void;
  miss: () => void;
  stopTurn: () => void;
  newSeries: () => void;
  nextManche: () => void;
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
  const { game, wins, seriesWinner, seriesTarget } = props;
  const showNextManche = game.status === Game_State.WON && seriesTarget > 1 && !seriesWinner;

  const currentTurnThrowCount =
    game.status === Game_State.WON
      ? 0
      : game.status === Game_State.WAITING_NEXT_PLAYER
      ? 3
      : 3 - game.dart_count;
  const currentTurnThrows =
    currentTurnThrowCount > 0 ? game.throws.slice(-currentTurnThrowCount) : [];

  const isGolf = game.scores[0]?.type === Game_Type.GOLF;
  const currentGolfTarget = isGolf ? holeTarget(currentHoleIndex(game)) : undefined;
  const canStopTurn =
    isGolf && game.status === Game_State.THROWING && game.dart_count < 3;

  const golfHoleIndex = isGolf ? currentHoleIndex(game) : -1;

  function golfBallsForHole(holeIndex: number, excludeCurrentPlayer: boolean) {
    const maxOffset = 0.11; // reste bien en-deca de la demi-largeur du secteur (~0.157 rad)
    const seatCount = game.players.length;
    const seatCenter = (seatCount - 1) / 2;
    return (game.scores as GolfScore[])
      .filter(
        (score) => !excludeCurrentPlayer || score.joueur.id !== game.current_player?.id
      )
      .map((score) => {
        const seatIndex = game.players.findIndex((p) => p.id === score.joueur.id);
        const angleOffset =
          seatCenter > 0 ? ((seatIndex - seatCenter) / seatCenter) * maxOffset : 0;
        return {
          joueur: score.joueur,
          stroke: score.strokes[holeIndex],
          angleOffset,
        };
      })
      .filter((ball): ball is { joueur: Joueur; stroke: number; angleOffset: number } =>
        ball.stroke !== undefined && ball.stroke >= 1 && ball.stroke <= 4
      );
  }

  const currentHoleBalls = isGolf ? golfBallsForHole(golfHoleIndex, true) : [];

  return (
    <svg
      version="1.1"
      width="1500"
      height="900"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <DefsComponent players={game.players} />
      </defs>
      <g transform={`translate(900,0)`}>
        <ScoreBoardComponent scores={game.scores} wins={wins} seriesTarget={props.seriesTarget} teams={game.teams} currentHole={currentGolfTarget}></ScoreBoardComponent>
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
        {sectionsOrder.map((value: number, index: number) => {
          const monsterOwner =
            game.scores[0] && game.scores[0].type === Game_Type.MONSTER
              ? findJoueurForAttack(game.scores as MonsterScore[], value)?.joueur
              : undefined;
          const isTarget = value === currentGolfTarget;
          // trous 1..value deja joues : holeTarget(i) = i+1, donc value <= golfHoleIndex
          // correspond a un trou strictement avant celui en cours (holeIndex = value-1).
          const isPastHole = isGolf && value >= 1 && value <= golfHoleIndex;
          return (
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
              <g
                transform={`rotate(${(360 / sectionsOrder.length) * index})`}
                style={{ ["--wire-gradient" as string]: `url(#wireMetal-${index})` } as React.CSSProperties}
              >
                {isCricketSection(value) && (
                  <CricketSectionComponent
                    scores={game.scores as CricketScore[]}
                    value={value}
                  ></CricketSectionComponent>
                )}
                <SectionComponent
                  tapHandler={props.tapHandler}
                  value={value}
                  player={monsterOwner}
                  current_player={game.current_player}
                  gameType={game.scores[0] && game.scores[0].type}
                  isTarget={isTarget}
                  isGolfHole={isTarget || isPastHole}
                  golfBalls={
                    isTarget
                      ? currentHoleBalls
                      : isPastHole
                      ? golfBallsForHole(value - 1, false)
                      : undefined
                  }
                ></SectionComponent>
              </g>
            </g>
          );
        })}
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
          <g className="waiting">
            <rect
              fill={`url(#grad-${seriesWinner.nom})`}
              className="panel"
              x="-200" y="-60" width="400" height="120" rx="15" ry="15"
            />
            <text className="text" dominantBaseline="middle" y="-18" textAnchor="middle">Champion !</text>
            <text className="text" dominantBaseline="middle" y="28" textAnchor="middle">{seriesWinner.nom}</text>
          </g>
        )}
      </g>
      <g transform="translate(1230,474)">
        <PerformanceChartComponent game={game} />
        {game.status !== Game_State.WON && (
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
        )}
        <g transform="translate(90,100)" onClick={() => router.push("/")}>
          <GameButtonComponent size={300} text="Retour" />
        </g>
        {canStopTurn && (
          <g transform="translate(70,256)">
            <TextComponent undo={props.stopTurn} text="Valider"></TextComponent>
          </g>
        )}
        {showNextManche && (
          <g transform="translate(90,30)" onClick={props.nextManche}>
            <GameButtonComponent size={300} text="Manche suivante" />
          </g>
        )}
        {seriesWinner && (
          <g transform="translate(90,30)" onClick={props.newSeries}>
            <GameButtonComponent size={300} text="Nouvelle série" />
          </g>
        )}
      </g>
    </svg>
  );
}
