import { useEloRankings } from "@/app/service/eloService";
import { Game_Type } from "@/app/Type/Game";

const GAME_TYPES: { key: Game_Type; label: string }[] = [
  { key: Game_Type.CRICKET, label: "Cricket" },
  { key: Game_Type.X01, label: "X01" },
  { key: Game_Type.MONSTER, label: "Monster" },
];

const COL_WIDTH = 210;
const ROW_HEIGHT = 38;
const HEADER_Y = 36;
const NAME_RECT_W = 130;
const NAME_RECT_H = 30;
const RANK_X = 10;
const RECT_X = 24;

function hsl(color: { h: number; s: number; l: number }) {
  return `hsl(${color.h}, ${color.s}%, ${color.l}%)`;
}

function RankingColumn({ gameType, label, x, showRank }: { gameType: Game_Type; label: string; x: number; showRank: boolean }) {
  const { rankings, isLoading } = useEloRankings(gameType);

  return (
    <g>
      <text x={x + COL_WIDTH / 2} y={18} textAnchor="middle" fontSize={18} fill="#888888">
        {label}
      </text>
      <line x1={x} y1={HEADER_Y} x2={x + COL_WIDTH - 10} y2={HEADER_Y} stroke="#333333" strokeWidth={1} />

      {isLoading && (
        <text x={x + COL_WIDTH / 2} y={HEADER_Y + 30} textAnchor="middle" fontSize={18} fill="#666666">
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
              <text x={x + RANK_X} y={y} textAnchor="middle" fontSize={22} fill="#aaaaaa">
                {entry.ranked ? i + 1 : "—"}
              </text>
            )}
            <rect
              x={x + RECT_X}
              y={y - NAME_RECT_H + 5}
              width={NAME_RECT_W}
              height={NAME_RECT_H}
              rx={5}
              fill={color}
            />
            <text
              x={x + RECT_X + NAME_RECT_W / 2}
              y={y - NAME_RECT_H / 2 + 5}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={22}
              fill="white"
            >
              {entry.joueur.nom}
            </text>
            <text x={x + COL_WIDTH - 8} y={y} textAnchor="end" fontSize={22} fill="#333333">
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
    <g style={{ fontFamily: "'m6x11plus'" }}>
      {GAME_TYPES.map((gt, i) => (
        <RankingColumn key={gt.key} gameType={gt.key} label={gt.label} x={i * COL_WIDTH} showRank={i === 0} />
      ))}
    </g>
  );
}
