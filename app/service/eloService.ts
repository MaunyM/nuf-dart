import useSWR from "swr";
import { useAuth } from "react-oidc-context";
import { Game_Type, Joueur } from "../Type/Game";
import {
  ELO_MIN_GAMES,
  EloByGameType,
  EloRankingEntry,
  GAME_TYPE_KEY,
  JoueurWithElo,
  PredictionResult,
} from "../Type/Elo";

const base_api = process.env.NEXT_PUBLIC_API;

const authFetcher = (token: string) => (url: string) =>
  fetch(url, { headers: { Authorization: token } }).then((r) => r.json());

export function useEloRankings(gameType: Game_Type): {
  rankings: EloRankingEntry[];
  isLoading: boolean;
  isError: unknown;
} {
  const auth = useAuth();
  const { data, error, isLoading } = useSWR<JoueurWithElo[]>(
    auth.isAuthenticated ? `${base_api}/elo` : null,
    authFetcher(auth.user?.id_token ?? "")
  );

  const key = GAME_TYPE_KEY[gameType];

  const rankings: EloRankingEntry[] = (data ?? [])
    .map((joueur) => {
      const elo = joueur.elo?.[key] ?? 1000;
      const gamesPlayed = joueur.gamesPlayed?.[key] ?? 0;
      const eloDelta = joueur.eloDelta?.[key] ?? 0;
      return {
        joueur,
        elo,
        gamesPlayed,
        eloDelta,
        ranked: gamesPlayed >= ELO_MIN_GAMES,
      };
    })
    .sort((a, b) => {
      if (a.ranked && !b.ranked) return -1;
      if (!a.ranked && b.ranked) return 1;
      return b.elo - a.elo;
    });

  return { rankings, isLoading, isError: error };
}

export function computeWinProbabilities(
  players: JoueurWithElo[],
  gameType: Game_Type
): PredictionResult[] {
  const key = GAME_TYPE_KEY[gameType];

  const eligible = players.map((p) => ({
    joueur: p,
    elo: p.elo?.[key] ?? 1000,
    qualified: (p.gamesPlayed?.[key] ?? 0) >= ELO_MIN_GAMES,
  }));

  const qualifiedCount = eligible.filter((e) => e.qualified).length;
  if (qualifiedCount < 2) {
    return players.map((joueur) => ({ joueur, winProbability: null }));
  }

  // Compute expected win score for each player vs all others (qualified only)
  const scores: Record<number, number> = {};
  for (const p of eligible) {
    scores[p.joueur.id] = 0;
  }

  for (let i = 0; i < eligible.length; i++) {
    for (let j = i + 1; j < eligible.length; j++) {
      const a = eligible[i];
      const b = eligible[j];
      if (!a.qualified || !b.qualified) continue;
      const ea = 1 / (1 + Math.pow(10, (b.elo - a.elo) / 400));
      scores[a.joueur.id] += ea;
      scores[b.joueur.id] += 1 - ea;
    }
  }

  const total = Object.values(scores).reduce((s, v) => s + v, 0);

  return players.map((joueur) => {
    const entry = eligible.find((e) => e.joueur.id === joueur.id)!;
    if (!entry.qualified) return { joueur, winProbability: null };
    const prob = total > 0 ? Math.round((scores[joueur.id] / total) * 100) : null;
    return { joueur, winProbability: prob };
  });
}

export function reportGameEnd(
  rankedPlayerIds: string[],
  gameType: Game_Type,
  token: string
): void {
  const key = GAME_TYPE_KEY[gameType];
  fetch(`${base_api}/game/end`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({ gameType: key, rankedPlayerIds }),
  }).catch(() => {});
}
