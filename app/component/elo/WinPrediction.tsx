import { computeWinProbabilities } from "@/app/service/eloService";
import { Game_Type } from "@/app/Type/Game";
import { JoueurWithElo } from "@/app/Type/Elo";

type Props = {
  players: JoueurWithElo[];
};

const GAME_TYPES: { key: Game_Type; label: string }[] = [
  { key: Game_Type.CRICKET, label: "Cricket" },
  { key: Game_Type.X01, label: "X01" },
  { key: Game_Type.MONSTER, label: "Monster" },
];

const COL_WIDTH = 220;
const BAR_WIDTH = 180;
const BAR_HEIGHT = 28;
const DOT_R = 6;
const LEGEND_ROW = 20;

function hsl(color: { h: number; s: number; l: number }) {
  return `hsl(${color.h}, ${color.s}%, ${color.l}%)`;
}

export default function WinPredictionComponent({ players }: Props) {
  if (players.length < 2) return null;

  return (
    <g className="win-prediction">
      <text x={0} y={-10} className="win-prediction-title">
        Prédiction de victoire
      </text>

      {GAME_TYPES.map((gt, colIdx) => {
        const results = computeWinProbabilities(players, gt.key);
        const ranked = results.filter((r) => r.winProbability != null);
        const x0 = colIdx * COL_WIDTH + 20;

        return (
          <g key={gt.key}>
            <text
              x={x0 + BAR_WIDTH / 2}
              y={18}
              textAnchor="middle"
              className="win-prediction-game-label"
            >
              {gt.label}
            </text>

            {/* Background bar */}
            <rect
              x={x0}
              y={28}
              width={BAR_WIDTH}
              height={BAR_HEIGHT}
              rx={6}
              fill="#cccccc"
              opacity={0.4}
            />

            {ranked.length < 2 ? (
              <text
                x={x0 + BAR_WIDTH / 2}
                y={28 + BAR_HEIGHT / 2 + 5}
                textAnchor="middle"
                className="win-prediction-unknown"
              >
                ?
              </text>
            ) : (
              (() => {
                let offsetX = 0;
                return ranked.map((r, i) => {
                  const segWidth = (r.winProbability! / 100) * BAR_WIDTH;
                  const isFirst = i === 0;
                  const isLast = i === ranked.length - 1;
                  const player = players.find((p) => p.id === r.joueur.id)!;
                  const rx = isFirst || isLast ? 6 : 0;
                  const seg = (
                    <rect
                      key={player.id}
                      x={x0 + offsetX}
                      y={28}
                      width={segWidth}
                      height={BAR_HEIGHT}
                      rx={rx}
                      fill={hsl(player.color)}
                      opacity={0.9}
                    />
                  );
                  offsetX += segWidth;
                  return seg;
                });
              })()
            )}

            {/* Legend */}
            {players.map((player, i) => {
              const y = 28 + BAR_HEIGHT + 12 + i * LEGEND_ROW;
              return (
                <g key={player.id}>
                  <circle
                    cx={x0 + DOT_R}
                    cy={y - DOT_R + 4}
                    r={DOT_R}
                    fill={hsl(player.color)}
                    opacity={0.9}
                  />
                  <text
                    x={x0 + DOT_R * 2 + 6}
                    y={y}
                    className="win-prediction-player-name"
                  >
                    {player.nom}
                  </text>
                </g>
              );
            })}
          </g>
        );
      })}
    </g>
  );
}
