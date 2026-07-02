import { EloRankingEntry } from "@/app/Type/Elo";

type Props = {
  rankings: EloRankingEntry[];
  isLoading: boolean;
};

const ROW_HEIGHT = 52;
const HEADER_HEIGHT = 44;

export default function EloRankingComponent({ rankings, isLoading }: Props) {
  if (isLoading) {
    return (
      <text className="elo-loading" textAnchor="middle">
        Chargement…
      </text>
    );
  }

  if (rankings.length === 0) {
    return (
      <text className="elo-empty" textAnchor="middle">
        Aucun joueur classé pour ce type de jeu
      </text>
    );
  }

  return (
    <g className="elo-ranking">
      {/* Header */}
      <g className="elo-header">
        <text x={40} y={28} className="elo-col-label">#</text>
        <text x={100} y={28} className="elo-col-label">Joueur</text>
        <text x={480} y={28} className="elo-col-label" textAnchor="end">ELO</text>
        <text x={600} y={28} className="elo-col-label" textAnchor="end">Parties</text>
        <text x={720} y={28} className="elo-col-label" textAnchor="end">Delta</text>
      </g>
      <line x1={20} y1={HEADER_HEIGHT} x2={760} y2={HEADER_HEIGHT} className="elo-separator" />

      {rankings.map((entry, index) => {
        const y = HEADER_HEIGHT + index * ROW_HEIGHT + ROW_HEIGHT / 2 + 8;
        const isUnranked = !entry.ranked;
        const deltaSign = entry.eloDelta > 0 ? "+" : "";
        const deltaClass = entry.eloDelta > 0
          ? "elo-delta-positive"
          : entry.eloDelta < 0
          ? "elo-delta-negative"
          : "elo-delta-neutral";

        return (
          <g key={entry.joueur.id} className={`elo-row ${isUnranked ? "elo-row-unranked" : ""}`}>
            <text x={40} y={y} className="elo-rank" textAnchor="middle">
              {isUnranked ? "—" : index + 1}
            </text>
            <text x={100} y={y} className="elo-name">
              {entry.joueur.nom}
            </text>
            <text x={480} y={y} className="elo-value" textAnchor="end">
              {isUnranked ? "?" : Math.round(entry.elo)}
            </text>
            <text x={600} y={y} className="elo-games" textAnchor="end">
              {entry.gamesPlayed}
            </text>
            <text x={720} y={y} className={deltaClass} textAnchor="end">
              {isUnranked ? "" : `${deltaSign}${Math.round(entry.eloDelta)}`}
            </text>
            {isUnranked && (
              <text x={100} y={y + 16} className="elo-unranked-label">
                non classé
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
}
