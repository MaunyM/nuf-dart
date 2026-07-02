import { useEloRankings } from "@/app/service/eloService";
import { Game_Type } from "@/app/Type/Game";

const GAME_TYPES: { key: Game_Type; label: string }[] = [
  { key: Game_Type.CRICKET, label: "Cricket" },
  { key: Game_Type.X01, label: "X01" },
  { key: Game_Type.MONSTER, label: "Monster" },
];

const COL_WIDTH = 210;
const ROW_HEIGHT = 26;
const HEADER_Y = 30;
const NAME_RECT_W = 125;
const NAME_RECT_H = 22;
const RANK_X = 10;
const RECT_X = 24;

function hsl(color: { h: number; s: number; l: number }) {
  return `hsl(${color.h}, ${color.s}%, ${color.l}%)`;
}

function RankingColumn({ gameType, label, x, showRank }: { gameType: Game_Type; label: string; x: number; showRank: boolean }) {
  const { rankings, isLoading } = useEloRankings(gameType);

  return (
    <g>
      <text x={x + COL_WIDTH / 2} y={16} textAnchor="middle" className="elo-col-label">
        {label}
      </text>
      <line x1={x} y1={HEADER_Y} x2={x + COL_WIDTH - 10} y2={HEADER_Y} className="elo-separator" />

      {isLoading && (
        <text x={x + COL_WIDTH / 2} y={HEADER_Y + 30} textAnchor="middle" className="elo-loading">
          …
        </text>
      )}

      {rankings.map((entry, i) => {
        const y = HEADER_Y + 8 + (i + 1) * ROW_HEIGHT;
        const opacity = entry.ranked ? 1 : 0.35;
        const color = hsl(entry.joueur.color);
        return (
          <g key={entry.joueur.id} opacity={opacity}>
            {showRank && (
              <text x={x + RANK_X} y={y} className="elo-rank" textAnchor="middle">
                {entry.ranked ? i + 1 : "—"}
              </text>
            )}
            <rect
              x={x + RECT_X}
              y={y - NAME_RECT_H + 4}
              width={NAME_RECT_W}
              height={NAME_RECT_H}
              rx={5}
              fill={color}
            />
            <text
              x={x + RECT_X + NAME_RECT_W / 2}
              y={y - NAME_RECT_H / 2 + 4}
              textAnchor="middle"
              dominantBaseline="middle"
              className="elo-name"
              fill="white"
            >
              {entry.joueur.nom}
            </text>
            <text x={x + COL_WIDTH - 8} y={y} textAnchor="end" className="elo-value">
              {entry.ranked ? Math.round(entry.elo) : "?"}
            </text>
          </g>
        );
      })}
    </g>
  );
}

export default function InlineRankings() {
  return (
    <g className="elo-ranking">
      {GAME_TYPES.map((gt, i) => (
        <RankingColumn key={gt.key} gameType={gt.key} label={gt.label} x={i * COL_WIDTH} showRank={i === 0} />
      ))}
    </g>
  );
}
