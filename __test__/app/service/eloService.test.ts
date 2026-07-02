import { describe, expect, it } from "vitest";
import { computeWinProbabilities } from "@/app/service/eloService";
import { Game_Type } from "@/app/Type/Game";
import { JoueurWithElo } from "@/app/Type/Elo";
import { Color } from "@/app/Type/Math";

function makePlayer(id: number, elo: number, gamesPlayed: number): JoueurWithElo {
  const color: Color = { h: 0, s: 0, l: 0 };
  return {
    id,
    nom: `Player ${id}`,
    color,
    elo: { cricket: elo, x01: elo, monster: elo },
    gamesPlayed: { cricket: gamesPlayed, x01: gamesPlayed, monster: gamesPlayed },
    eloDelta: { cricket: 0, x01: 0, monster: 0 },
  };
}

describe("computeWinProbabilities", () => {
  it("returns probabilities that sum to 100 for two ranked players", () => {
    const players = [makePlayer(1, 1100, 5), makePlayer(2, 900, 5)];
    const results = computeWinProbabilities(players, Game_Type.CRICKET);

    const probs = results.map((r) => r.winProbability);
    expect(probs[0]).not.toBeNull();
    expect(probs[1]).not.toBeNull();
    expect((probs[0] as number) + (probs[1] as number)).toBe(100);
  });

  it("gives higher probability to player with higher ELO", () => {
    const players = [makePlayer(1, 1100, 5), makePlayer(2, 900, 5)];
    const results = computeWinProbabilities(players, Game_Type.CRICKET);

    expect(results[0].winProbability).toBeGreaterThan(50);
    expect(results[1].winProbability).toBeLessThan(50);
  });

  it("returns null for unranked player (< 3 games)", () => {
    const players = [makePlayer(1, 1100, 5), makePlayer(2, 900, 2)];
    const results = computeWinProbabilities(players, Game_Type.CRICKET);

    const ranked = results.find((r) => r.joueur.id === 1);
    const unranked = results.find((r) => r.joueur.id === 2);

    expect(unranked?.winProbability).toBeNull();
    expect(ranked?.winProbability).toBeNull();
  });

  it("returns all null when all players are unranked", () => {
    const players = [makePlayer(1, 1000, 0), makePlayer(2, 1000, 1)];
    const results = computeWinProbabilities(players, Game_Type.X01);

    results.forEach((r) => expect(r.winProbability).toBeNull());
  });

  it("handles three players correctly", () => {
    const players = [
      makePlayer(1, 1200, 10),
      makePlayer(2, 1000, 10),
      makePlayer(3, 800, 10),
    ];
    const results = computeWinProbabilities(players, Game_Type.CRICKET);

    const probs = results.map((r) => r.winProbability as number);
    expect(probs[0]).toBeGreaterThan(probs[1]);
    expect(probs[1]).toBeGreaterThan(probs[2]);
  });

  it("returns 50/50 for equal ELOs", () => {
    const players = [makePlayer(1, 1000, 5), makePlayer(2, 1000, 5)];
    const results = computeWinProbabilities(players, Game_Type.MONSTER);

    expect(results[0].winProbability).toBe(50);
    expect(results[1].winProbability).toBe(50);
  });
});
