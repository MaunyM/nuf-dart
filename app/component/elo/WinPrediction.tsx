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

const COL_WIDTH = 300;
const ROW_HEIGHT = 36;

export default function WinPredictionComponent({ players }: Props) {
  if (players.length < 2) return null;

  return (
    <g className="win-prediction">
      <text x={0} y={-10} className="win-prediction-title">
        Prédiction de victoire
      </text>

      {/* Headers */}
      {GAME_TYPES.map((gt, colIdx) => (
        <text
          key={gt.key}
          x={colIdx * COL_WIDTH + COL_WIDTH / 2}
          y={18}
          textAnchor="middle"
          className="win-prediction-game-label"
        >
          {gt.label}
        </text>
      ))}

      {/* Player rows per game type */}
      {players.map((player, rowIdx) => {
        const y = 44 + rowIdx * ROW_HEIGHT;
        return (
          <g key={player.id}>
            {GAME_TYPES.map((gt, colIdx) => {
              const results = computeWinProbabilities(players, gt.key);
              const result = results.find((r) => r.joueur.id === player.id);
              const prob = result?.winProbability;
              return (
                <g key={gt.key}>
                  <text
                    x={colIdx * COL_WIDTH + 20}
                    y={y}
                    className="win-prediction-player-name"
                  >
                    {player.nom}
                  </text>
                  <text
                    x={colIdx * COL_WIDTH + COL_WIDTH - 20}
                    y={y}
                    textAnchor="end"
                    className={
                      prob == null
                        ? "win-prediction-unknown"
                        : prob >= 50
                        ? "win-prediction-high"
                        : "win-prediction-low"
                    }
                  >
                    {prob === null ? "?" : `${prob}%`}
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
