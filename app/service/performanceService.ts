import { DartThrow, Game_Type, Joueur, mults } from "../Type/Game";
import { CRICKET_ZONES } from "../Type/Cricket";

const VOLLEY_SIZE = 3;
const MAX_HISTORY_LENGTH = 5;

function computeVolleyValue(volley: DartThrow[], gameType: Game_Type): number {
  switch (gameType) {
    case Game_Type.CRICKET:
      return volley.reduce(
        (sum, t) => sum + (CRICKET_ZONES.includes(t.value) ? mults[t.ring] : 0),
        0
      );
    case Game_Type.MONSTER:
      return volley.reduce(
        (count, t) => count + (t.targetZones?.includes(t.value) ? 1 : 0),
        0
      );
    case Game_Type.X01:
    default:
      return (
        volley.reduce((sum, t) => sum + t.value * mults[t.ring], 0) / VOLLEY_SIZE
      );
  }
}

export function getPlayerPerformanceHistory(
  throws: DartThrow[],
  joueur: Joueur,
  gameType: Game_Type
): number[] {
  const playerThrows = throws.filter((t) => t.player.id === joueur.id);
  const history: number[] = [];

  for (let i = 0; i + VOLLEY_SIZE <= playerThrows.length; i += VOLLEY_SIZE) {
    const volley = playerThrows.slice(i, i + VOLLEY_SIZE);
    history.push(computeVolleyValue(volley, gameType));
  }

  return history.slice(-MAX_HISTORY_LENGTH);
}

export function getPerformanceUnit(gameType: Game_Type): string {
  switch (gameType) {
    case Game_Type.CRICKET:
      return "marques/volée";
    case Game_Type.MONSTER:
      return "zones/3";
    case Game_Type.X01:
    default:
      return "pts/volée";
  }
}
