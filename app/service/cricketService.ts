import { CRICKET_ZONES, CricketScore } from "../Type/Cricket";
import { JoueurCricket, Ring, mults } from "../Type/Game";

export function Score_dart(current_score: CricketScore, value: number, ring: Ring):CricketScore {
    if (!CRICKET_ZONES.includes(value)) return current_score;
    const new_value_count =  Math.min(3,current_score.marks[value] + mults[ring]);
    const new_score =
      current_score.score +
      value * Math.max(0, mults[ring] - (3 - current_score.marks[value]));
    
    return new CricketScore({ ...current_score.marks, [value]: new_value_count }, new_score);
}

export function isCricketSection(value:number) {
  return CRICKET_ZONES.includes(value)
 }

function topScorer(currentPlayer: JoueurCricket, players: JoueurCricket[]):boolean {
  return players.every(player => player.score.score < currentPlayer.score.score);
}

export function isOpen(currentPlayer: JoueurCricket, value: number):boolean {
  const marks = currentPlayer.score.marks;
  return marks[value] === 3;
}

function allOpen(currentPlayer: JoueurCricket):boolean {
  const marks = currentPlayer.score.marks;
  return Object.keys(marks).every((key) => marks[+key] === 3);
}

export function isWon(currentPlayer: JoueurCricket, players: JoueurCricket[]) {
  return topScorer(currentPlayer, players) && allOpen(currentPlayer);
}