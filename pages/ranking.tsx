import EloRankingComponent from "@/app/component/elo/EloRanking";
import { useEloRankings } from "@/app/service/eloService";
import { Game_Type } from "@/app/Type/Game";
import { useRouter } from "next/router";
import { useState } from "react";
import "./ranking.css";

const TABS: { label: string; type: Game_Type }[] = [
  { label: "Cricket", type: Game_Type.CRICKET },
  { label: "X01", type: Game_Type.X01 },
  { label: "Monster", type: Game_Type.MONSTER },
];

function RankingTab({ gameType }: { gameType: Game_Type }) {
  const { rankings, isLoading } = useEloRankings(gameType);
  return <EloRankingComponent rankings={rankings} isLoading={isLoading} />;
}

export default function RankingPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Game_Type>(Game_Type.CRICKET);

  return (
    <div className="ranking-page">
      <svg version="1.1" width="1500" height="800" xmlns="http://www.w3.org/2000/svg">
        <text x={20} y={50} className="ranking-title">Classement ELO</text>

        {/* Back button */}
        <g onClick={() => router.back()} style={{ cursor: "pointer" }}>
          <text x={1420} y={50} className="ranking-back">← Retour</text>
        </g>

        {/* Tabs */}
        <g transform="translate(20, 70)">
          {TABS.map((tab, i) => (
            <g
              key={tab.type}
              transform={`translate(${i * 220}, 0)`}
              onClick={() => setActiveTab(tab.type)}
              style={{ cursor: "pointer" }}
            >
              <rect
                width={200}
                height={44}
                rx={8}
                className={`ranking-tab ${activeTab === tab.type ? "ranking-tab-active" : ""}`}
              />
              <text
                x={100}
                y={28}
                textAnchor="middle"
                className={`ranking-tab-label ${activeTab === tab.type ? "ranking-tab-label-active" : ""}`}
              >
                {tab.label}
              </text>
            </g>
          ))}
        </g>

        {/* Ranking table */}
        <g transform="translate(20, 140)">
          <RankingTab gameType={activeTab} />
        </g>
      </svg>
    </div>
  );
}
