import { Score_dart } from "../service/cricketService";
import { Ring, Score } from "./Game";

export const CRICKET_ZONES = [20, 19, 18, 17, 16, 15, 25];

export type Marks = Record<number, number>

export class CricketScore implements Score {
  marks: Marks = {};
  score: number = 0;
  add(value: number, ring: Ring) {
    return Score_dart(this, value, ring);
  }
  constructor(marks: Marks, score: number = 0) {
    this.marks = marks;
    this.score = score;
  }
}


