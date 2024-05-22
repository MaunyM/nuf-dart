import { Score_dart } from "../service/cricketService";
import { Ring, Score } from "./Game";

export const CRICKET_ZONES = [20, 19, 18, 17, 16, 15, 25];


export class CricketScore implements Score {
  marks: Record<number, number> = {};
  score: number = 0;
  allOpen(marks: Record<number, number>) {
    return CRICKET_ZONES.some((zone) => marks[zone] != 3);
  }
  add(value: number, ring: Ring) {
    return Score_dart(this, value, ring);
  }
  constructor(marks: Record<number, number>, score: number = 0) {
    this.marks = marks;
    this.score = score;
  }
}


