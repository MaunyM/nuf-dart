"use client";

import React from "react";
import { Game } from "../../Type/Game";
import { getPlayerPerformanceHistory } from "../../service/performanceService";
import "./PerformanceChart.css";

type PerformanceChartProps = {
  game: Game;
};

const MAX_POINTS = 5;
const PLOT_WIDTH = 250;
const PLOT_HEIGHT = 50;
const X_STEP = PLOT_WIDTH / (MAX_POINTS - 1);

export default function PerformanceChartComponent({ game }: PerformanceChartProps) {
  const players = game.players ?? [];
  const performances = players.map((joueur) => ({
    joueur,
    history: getPlayerPerformanceHistory(game.throws, joueur),
  }));

  const allValues = performances.flatMap((p) => p.history);
  const maxValue = Math.max(1, ...allValues);
  const toY = (value: number) => PLOT_HEIGHT - (value / maxValue) * PLOT_HEIGHT;
  const hasAnyHistory = allValues.length > 0;

  return (
    <g className="performance-chart" transform="translate(-40,-64)">
      <rect className="background" x={0} y={0} width={260} height={60} rx={8} ry={8} />
      <g transform="translate(5,8)">
        <line className="axis" x1={0} y1={PLOT_HEIGHT} x2={PLOT_WIDTH} y2={PLOT_HEIGHT} />
        {!hasAnyHistory && (
          <text
            className="empty-text"
            x={PLOT_WIDTH / 2}
            y={PLOT_HEIGHT / 2}
            textAnchor="middle"
            dominantBaseline="middle"
          >
            —
          </text>
        )}
        {performances.map(({ joueur, history }, index) =>
          history.length > 0 ? (
            <g key={joueur.id}>
              <polyline
                className="series-line"
                stroke={`url(#grad-${joueur.nom})`}
                points={history.map((value, i) => `${i * X_STEP},${toY(value)}`).join(" ")}
              />
              {history.map((value, i) => (
                <circle
                  key={i}
                  className="series-point"
                  cx={i * X_STEP}
                  cy={toY(value)}
                  r={3}
                  fill={`url(#grad-${joueur.nom})`}
                />
              ))}
            </g>
          ) : (
            hasAnyHistory && (
              <text
                key={joueur.id}
                className="empty-marker"
                x={2}
                y={10 + index * 12}
                dominantBaseline="middle"
                fill={`url(#grad-${joueur.nom})`}
              >
                —
              </text>
            )
          )
        )}
      </g>
    </g>
  );
}
