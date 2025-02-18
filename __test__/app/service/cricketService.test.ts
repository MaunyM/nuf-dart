import { expect, test } from "vitest";
import {
  allOpen,
  compareCricketScore,
  getScoreFromPlayer,
  isCricketSection,
  isOpen,
  isWon,
  sorteCricketScore,
  topScorer,
} from "../../../app/service/cricketService";
import { CricketScore } from "@/app/Type/Cricket";
import { Joueur } from "@/app/Type/Game";

const matthieu: Joueur = {
  id: 1,
  nom: "Matthieu",
  color: {
    h: 0,
    s: 0,
    l: 0,
  },
};

const patate: Joueur = {
  id: 3,
  nom: "Patate",
  color: {
    h: 0,
    s: 0,
    l: 0,
  },
};

const celia: Joueur = {
  id: 2,
  nom: "Celia",
  color: {
    h: 0,
    s: 0,
    l: 0,
  },
};
const winner: Joueur = {
  id: 4,
  nom: "Winner",
  color: {
    h: 0,
    s: 0,
    l: 0,
  },
};

const allOpenPlayer: Joueur = {
  id: 5,
  nom: "allOpen",
  color: {
    h: 0,
    s: 0,
    l: 0,
  },
};

const matthieuCricketScore: CricketScore = {
  marks: { 20: 2 },
  score: 1,
  joueur: matthieu,
};

const patateCricketScore: CricketScore = {
  marks: { 18: 1, 19: 2 },
  score: 2,
  joueur: patate,
};

const celiaCricketScore: CricketScore = {
  marks: { 25: 3, 19: 2 },
  score: 3,
  joueur: celia,
};

const winnerCricketScore: CricketScore = {
  marks: { 25: 3, 20: 3, 19: 3, 18: 3, 17: 3, 16: 3, 15: 3 },
  score: 50,
  joueur: winner,
};

const allOpenCricketScore: CricketScore = {
  marks: { 25: 3, 20: 3, 19: 3, 18: 3, 17: 3, 16: 3, 15: 3 },
  score: 40,
  joueur: allOpenPlayer,
};

test("A positive value indicates that a should come after b.", () => {
  expect(
    compareCricketScore(matthieuCricketScore, celiaCricketScore)
  ).to.be.above(0);
});
test("A negative value indicates that a should come before b", () => {
  expect(
    compareCricketScore(celiaCricketScore, matthieuCricketScore)
  ).to.be.below(0);
});
test("Zero or NaN indicates that a and b are considered equal", () => {
  expect(compareCricketScore(celiaCricketScore, celiaCricketScore)).to.be.eq(0);
});
test("Sort sorted array", () => {
  expect(
    sorteCricketScore([
      celiaCricketScore,
      patateCricketScore,
      matthieuCricketScore,
    ])[0].score
  ).to.be.eq(3);
});
test("Sort unsorted array", () => {
  expect(
    sorteCricketScore([
      patateCricketScore,
      celiaCricketScore,
      matthieuCricketScore,
    ])[0].score
  ).to.be.eq(3);
});
test("Top scorer sorted array", () => {
  expect(
    topScorer([celiaCricketScore, patateCricketScore, matthieuCricketScore])
  ).to.be.eq(celia);
});
test("Top scorer unsorted array", () => {
  expect(
    topScorer([patateCricketScore, celiaCricketScore, matthieuCricketScore])
  ).to.be.eq(celia);
});
test("20 is a cricket section", () => {
  expect(isCricketSection(20)).to.be.true;
});
test("7 is not a cricket section", () => {
  expect(isCricketSection(7)).to.be.false;
});
test("19 is not open for Celia", () => {
  expect(isOpen(celiaCricketScore, 19)).to.be.false;
});
test("25 is  open for Celia", () => {
  expect(isOpen(celiaCricketScore, 25)).to.be.true;
});
test("The score of celia is Celia's score", () => {
  expect(
    getScoreFromPlayer(
      [celiaCricketScore, matthieuCricketScore, patateCricketScore],
      celia
    )
  ).to.be.equal(celiaCricketScore);
});
test("The score of celia is Celia's score not the first", () => {
  expect(
    getScoreFromPlayer(
      [matthieuCricketScore, celiaCricketScore, patateCricketScore],
      celia
    )
  ).to.be.equal(celiaCricketScore);
});
test("All section are not open for celia ", () => {
  expect(allOpen(celiaCricketScore)).to.be.false;
});
test("All section are  open for AllOpen ", () => {
  expect(allOpen(allOpenCricketScore)).to.be.true;
});
test("All section are  open for winner ", () => {
  expect(allOpen(winnerCricketScore)).to.be.true;
});
test("Winner is winner ", () => {
  expect(
    isWon(winner, [
      matthieuCricketScore,
      celiaCricketScore,
      patateCricketScore,
      winnerCricketScore,
      allOpenCricketScore,
    ])
  ).to.be.true;
});
test("Matthieu is not winner ", () => {
  expect(
    isWon(matthieu, [
      matthieuCricketScore,
      celiaCricketScore,
      patateCricketScore,
      winnerCricketScore,
      allOpenCricketScore,
    ])
  ).to.be.false;
});
test("AllOpen is not winner ", () => {
  expect(
    isWon(allOpenPlayer, [
      matthieuCricketScore,
      celiaCricketScore,
      patateCricketScore,
      winnerCricketScore,
      allOpenCricketScore,
    ])
  ).to.be.false;
});
