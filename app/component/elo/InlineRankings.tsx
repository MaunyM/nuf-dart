import { useEloRankings } from "@/app/service/eloService";
import { Game_Type } from "@/app/Type/Game";
import BlobComponent from "../monster/Blob";

const GAME_TYPES: { key: Game_Type; label: string }[] = [
  { key: Game_Type.CRICKET, label: "Cricket" },
  { key: Game_Type.X01, label: "X01" },
  { key: Game_Type.MONSTER, label: "Monster" },
];

const COL_WIDTH = 230;
const ROW_HEIGHT = 38;
const HEADER_Y = 36;
const NAME_RECT_W = 130;
const NAME_RECT_H = 30;
const RANK_X = 10;
const RECT_X = 24;

function hsl(color: { h: number; s: number; l: number }) {
  return `hsl(${color.h}, ${color.s}%, ${color.l}%)`;
}

const BLOB_SCALE = 0.215;
const BLOB_W = Math.round(120 * BLOB_SCALE); // ~26px
// #big shape spans y=0..110 in a 140px SVG → visual height ≈ 110*BLOB_SCALE ≈ 24px
// rect height = 30px → center offset = (30 - 24) / 2 ≈ 3px
const BLOB_Y_OFFSET = Math.round((NAME_RECT_H - 110 * BLOB_SCALE) / 2);
const BLOB_X_OFFSET = 3;

function RankingColumn({ gameType, label, x, showRank }: { gameType: Game_Type; label: string; x: number; showRank: boolean }) {
  const showBlob = gameType === Game_Type.MONSTER;
  const { rankings, isLoading } = useEloRankings(gameType);

  return (
    <g>
      <text x={x + COL_WIDTH / 2} y={24} textAnchor="middle" fontSize={26} fill="#888888">
        {label}
      </text>
      <line x1={x + 10} y1={HEADER_Y} x2={x + COL_WIDTH - 10} y2={HEADER_Y} stroke="#333333" strokeWidth={1} />

      {isLoading && (
        <text x={x + COL_WIDTH / 2} y={HEADER_Y + 30} textAnchor="middle" fontSize={18} fill="#666666">
          …
        </text>
      )}

      {rankings.map((entry, i) => {
        const y = HEADER_Y + 8 + (i + 1) * ROW_HEIGHT;
        const yMid = y - NAME_RECT_H / 2 + 5;
        const opacity = entry.ranked ? 1 : 0.35;
        const color = hsl(entry.joueur.color);
        return (
          <g key={entry.joueur.id} opacity={opacity}>
            {showRank && (
              <text x={x + RANK_X} y={yMid} textAnchor="middle" dominantBaseline="middle" fontSize={22} fill="#aaaaaa">
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
            {showBlob && (
              <g transform={`translate(${x + RECT_X + BLOB_X_OFFSET}, ${y - NAME_RECT_H + 5 + BLOB_Y_OFFSET}) scale(${BLOB_SCALE})`}>
                <BlobComponent joueur={entry.joueur} animated={false} />
              </g>
            )}
            <text
              x={showBlob ? x + RECT_X + BLOB_X_OFFSET + BLOB_W + (NAME_RECT_W - BLOB_X_OFFSET - BLOB_W) / 2 : x + RECT_X + NAME_RECT_W / 2}
              y={y - NAME_RECT_H / 2 + 5}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={22}
              fill="white"
            >
              {entry.joueur.nom}
            </text>
            {entry.ranked && entry.eloDelta !== 0 && (
              <text
                x={x + RECT_X + NAME_RECT_W + 8}
                y={yMid}
                dominantBaseline="middle"
                fontSize={18}
                fill={entry.eloDelta > 0 ? "#44cc66" : "#ff4444"}
              >
                {entry.eloDelta > 0 ? "▲" : "▼"}
              </text>
            )}
            <text x={x + COL_WIDTH - 8} y={yMid} textAnchor="end" dominantBaseline="middle" fontSize={18} fill="#888888">
              {entry.ranked ? Math.round(entry.elo) : "?"}
            </text>
          </g>
        );
      })}
    </g>
  );
}

export default function InlineRankings() {
  const totalHeight = HEADER_Y + 8 + 8 * ROW_HEIGHT;

  return (
    <g style={{ fontFamily: "'m6x11plus'" }}>
      {GAME_TYPES.map((gt, i) => (
        <RankingColumn key={gt.key} gameType={gt.key} label={gt.label} x={i * COL_WIDTH} showRank={i === 0} />
      ))}
      {[1, 2].map((i) => (
        <line key={i} x1={i * COL_WIDTH} y1={0} x2={i * COL_WIDTH} y2={totalHeight} stroke="#444444" strokeWidth={1} />
      ))}
    </g>
  );
}
