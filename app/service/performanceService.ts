import { DartThrow, Joueur, mults } from "../Type/Game";

const VOLLEY_SIZE = 3;
const MAX_HISTORY_LENGTH = 5;

export function getPlayerPerformanceHistory(
  throws: DartThrow[],
  joueur: Joueur
): number[] {
  const playerThrows = throws.filter((t) => t.player.id === joueur.id);
  const history: number[] = [];

  for (let i = 0; i + VOLLEY_SIZE <= playerThrows.length; i += VOLLEY_SIZE) {
    const volley = playerThrows.slice(i, i + VOLLEY_SIZE);
    const points = volley.reduce(
      (sum, t) => sum + t.value * mults[t.ring],
      0
    );
    history.push(points / VOLLEY_SIZE);
  }

  return history.slice(-MAX_HISTORY_LENGTH);
}
