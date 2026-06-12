import { Joueur, Team } from "../Type/Game";
import { MonsterScore } from "../Type/Monster";

export function validateTeams(teams: Team[], selectedPlayers: Joueur[]): boolean {
  if (teams.length < 2) return false;
  if (teams.some((team) => team.players.length < 2)) return false;

  const assignedIds = teams.flatMap((team) => team.players.map((p) => p.id));
  const uniqueAssignedIds = new Set(assignedIds);
  if (uniqueAssignedIds.size !== assignedIds.length) return false;
  if (uniqueAssignedIds.size !== selectedPlayers.length) return false;

  return selectedPlayers.every((player) => uniqueAssignedIds.has(player.id));
}

export function interleaveByTeam(teams: Team[]): Joueur[] {
  const queues = teams.map((team) => [...team.players]);
  const result: Joueur[] = [];
  let remaining = queues.reduce((sum, queue) => sum + queue.length, 0);

  while (remaining > 0) {
    for (const queue of queues) {
      if (queue.length > 0) {
        result.push(queue.shift() as Joueur);
        remaining--;
      }
    }
  }

  return result;
}

export function updateTeamScore(
  scores: MonsterScore[],
  teamId: number,
  delta: number,
  maxScore: number
): MonsterScore[] {
  return scores.map((score) =>
    score.teamId === teamId
      ? { ...score, score: Math.min(Math.max(score.score + delta, 0), maxScore) }
      : score
  );
}
