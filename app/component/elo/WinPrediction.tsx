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
const NAME_WIDTH = 75;
const BAR_MAX_WIDTH = 130;
const BAR_HEIGHT = 18;
const ROW_HEIGHT = 32;

export default function WinPredictionComponent({ players }: Props) {
  if (players.length < 2) return null;

  return (
    <g className="win-prediction">
      <text x={0} y={-10} className="win-prediction-title">
        Prédiction de victoire
      </text>

      {GAME_TYPES.map((gt, colIdx) => {
        const results = computeWinProbabilities(players, gt.key);
        const x0 = colIdx * COL_WIDTH;

        return (
          <g key={gt.key}>
            <text
              x={x0 + COL_WIDTH / 2}
              y={18}
              textAnchor="middle"
              className="win-prediction-game-label"
            >
              {gt.label}
            </text>

            {players.map((player, rowIdx) => {
              const y = 44 + rowIdx * ROW_HEIGHT;
              const result = results.find((r) => r.joueur.id === player.id);
              const prob = result?.winProbability;
              const barWidth =
                prob != null ? (prob / 100) * BAR_MAX_WIDTH : 0;
              const hsl = `hsl(${player.color.h}, ${player.color.s}%, ${player.color.l}%)`;

              return (
                <g key={player.id}>
                  <text
                    x={x0 + 10}
                    y={y}
                    className="win-prediction-player-name"
                  >
                    {player.nom}
                  </text>
                  {prob != null ? (
                    <rect
                      x={x0 + NAME_WIDTH}
                      y={y - BAR_HEIGHT + 4}
                      width={barWidth}
                      height={BAR_HEIGHT}
                      rx={4}
                      fill={hsl}
                      opacity={0.85}
                    />
                  ) : (
                    <text
                      x={x0 + NAME_WIDTH + 10}
                      y={y}
                      className="win-prediction-unknown"
                    >
                      ?
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        );
      })}
    </g>
  );
}
