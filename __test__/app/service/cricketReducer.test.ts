import { expect, test } from "vitest";
import { cricketReduce, isOpenForEveryone } from "../../../app/service/cricketService";
import {
  DartThrow,
  Game,
  Game_Event,
  Game_State,
  Game_Type,
  GameObserver,
  Joueur,
} from "@/app/Type/Game";
import { defaultCricketGame } from "@/app/service/defaultGame";
import { CricketScore } from "@/app/Type/Cricket";
import { exec } from "child_process";

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

const throw20: DartThrow = {
  player: matthieu,
  value: 20,
  ring: 1,
  date: new Date("1995-12-17T03:24:00"),
};

const throw12: DartThrow = {
  player: matthieu,
  value: 12,
  ring: 0,
  date: new Date("1995-12-17T03:25:00"),
};
const players = [matthieu, patate, celia];
const TwoPlayers = [matthieu, celia];

test("Throw must be added to the game's throws", () => {
  const game = { ...defaultCricketGame, players, status: Game_State.THROWING };
  const throws = [throw20];
  const updatedGame = throws.reduce(cricketReduce, game);
  expect(updatedGame.throws.length).toBe(1);
  expect(updatedGame.throws[0]).toEqual(throw20);
});

test("Two Throw must be added to the game's throws", () => {
  const game = { ...defaultCricketGame, players, status: Game_State.THROWING };
  const throws = [throw20, throw12];
  const updatedGame = throws.reduce(cricketReduce, game);
  expect(updatedGame.throws.length).toBe(2);
  expect(updatedGame.throws[0]).toEqual(throw20);
  expect(updatedGame.throws[1]).toEqual(throw12);
});

test("First player is Matthieu", () => {
  const game = { ...defaultCricketGame, players, status: Game_State.THROWING };
  const throws = [throw20];
  const updatedGame = throws.reduce(cricketReduce, game);
  expect(updatedGame.current_player).toBe(matthieu);
});

test("First player is again Matthieu", () => {
  const game = { ...defaultCricketGame, players, status: Game_State.THROWING };
  const throws = [throw20, throw12];
  const updatedGame = throws.reduce(cricketReduce, game);
  expect(updatedGame.current_player).toBe(matthieu);
});

test("Second player is Patate", () => {
  const game = { ...defaultCricketGame, players, status: Game_State.THROWING };
  const throws = [throw20, throw20, throw20];
  const updatedGame = throws.reduce(cricketReduce, game);
  expect(updatedGame.current_player).toBe(patate);
});

test("Third player is Celia", () => {
  const game = { ...defaultCricketGame, players, status: Game_State.THROWING };
  const throws = [
    throw20,
    throw20,
    throw20,
    throw20,
    throw20,
    throw20,
    throw20,
  ]; //7 throws
  const updatedGame = throws.reduce(cricketReduce, game);
  expect(updatedGame.current_player).toBe(celia);
});

test("5th player is Patate", () => {
  const game = { ...defaultCricketGame, players, status: Game_State.THROWING };
  const throws = [
    throw20,
    throw20,
    throw20,
    throw20,
    throw20,
    throw20,
    throw20,
    throw20,
    throw20,
    throw20,
    throw20,
    throw20,
  ]; //12 throws
  const updatedGame = throws.reduce(cricketReduce, game);
  expect(updatedGame.current_player).toBe(patate);
});

test("5th player is Patate", () => {
  const game = { ...defaultCricketGame, players, status: Game_State.THROWING };
  const throws = [
    throw20,
    throw20,
    throw20,
    throw20,
    throw20,
    throw20,
    throw20,
    throw20,
    throw20,
    throw20,
    throw20,
    throw20,
    throw20,
  ]; //13 throws
  const updatedGame = throws.reduce(cricketReduce, game);
  expect(updatedGame.current_player).toBe(patate);
});

test("Matthieu have 3 dart left", () => {
  const game = { ...defaultCricketGame, players, current_player: matthieu };
  expect(game.players[0].nom).toBe("Matthieu");
  expect(game.dart_count).toBe(3);
});

test("Matthieu have 2 dart left", () => {
  const game = {
    ...defaultCricketGame,
    players,
    current_player: matthieu,
    status: Game_State.THROWING,
  };
  const throws = [throw20]; //1 throws
  const updatedGame = throws.reduce(cricketReduce, game);
  expect(updatedGame.dart_count).toBe(2);
  expect(updatedGame.current_player).toBe(matthieu);
});

test("celia have 3 dart left", () => {
  const game = {
    ...defaultCricketGame,
    players: TwoPlayers,
    current_player: matthieu,
    status: Game_State.THROWING,
  };
  const throws = [throw20, throw20, throw20, throw20]; //4 throws
  const updatedGame = throws.reduce(cricketReduce, game);
  expect(updatedGame.dart_count).toBe(2);
  expect(updatedGame.current_player).toBe(celia);
});

test("new turn matthieu have 3 dart left", () => {
  const game = {
    ...defaultCricketGame,
    players: TwoPlayers,
    current_player: matthieu,
  };
  const throws = [throw20, throw20, throw20, throw20, throw20, throw20]; //6 throws
  const updatedGame = throws.reduce(cricketReduce, game);
  expect(updatedGame.dart_count).toBe(3);
  expect(updatedGame.current_player).toBe(matthieu);
});

test("new turn celia have 3 dart left", () => {
  const game = {
    ...defaultCricketGame,
    players: TwoPlayers,
    current_player: matthieu,
    status: Game_State.THROWING,
  };
  const throws = [
    throw20,
    throw20,
    throw20,
    throw20,
    throw20,
    throw20,
    throw20,
    throw20,
    throw20,
  ]; //9 throws
  const updatedGame = throws.reduce(cricketReduce, game);
  expect(updatedGame.dart_count).toBe(3);
  expect(updatedGame.current_player).toBe(celia);
});

test("Two 20 marks for matthieu", () => {
  const game = {
    ...defaultCricketGame,
    players: TwoPlayers,
    current_player: matthieu,
    status: Game_State.THROWING,
    scores: TwoPlayers.map((player: Joueur) => new CricketScore(player)),
  };
  const throws = [throw20, throw20]; //2 throws
  const updatedGame = throws.reduce(cricketReduce, game);
  expect(updatedGame.dart_count).toBe(1);
  expect(updatedGame.current_player).toBe(matthieu);
  expect((updatedGame.scores[0] as CricketScore).marks[20]).toBe(2);
});

test("Second player keep throwing", () => {
  const game = {
    ...defaultCricketGame,
    players: TwoPlayers,
    current_player: matthieu,
    status: Game_State.THROWING,
    scores: TwoPlayers.map((player: Joueur) => new CricketScore(player)),
  };
  const throws = [throw20, throw20,throw20, throw20]; //4 throws
  const updatedGame = throws.reduce(cricketReduce, game);
  expect(updatedGame.dart_count).toBe(2);
  expect(updatedGame.status).toBe(Game_State.THROWING);
  expect(updatedGame.current_player).toBe(celia);
  expect((updatedGame.scores[0] as CricketScore).marks[20]).toBe(3);
  expect((updatedGame.scores[1] as CricketScore).marks[20]).toBe(1);
});

test("Matthieu can't score", () => {
  const game = {
    ...defaultCricketGame,
    players: TwoPlayers,
    current_player: matthieu,
    status: Game_State.THROWING,
    scores: TwoPlayers.map((player: Joueur) => new CricketScore(player)),
  };
  const throws = [throw20, throw20,throw20, throw20,throw20, throw20,throw20, throw20]; //8 throws
  const updatedGame = throws.reduce(cricketReduce, game);
  expect(updatedGame.dart_count).toBe(1);
  expect(updatedGame.status).toBe(Game_State.THROWING);
  expect(updatedGame.current_player).toBe(matthieu);
  expect((updatedGame.scores[0] as CricketScore).marks[20]).toBe(3);
  expect((updatedGame.scores[1] as CricketScore).marks[20]).toBe(3);
  expect(isOpenForEveryone(updatedGame.scores as CricketScore[], 20)).toBe(true);
  expect((updatedGame.scores[0] as CricketScore).score).toBe(0);
});

test("All open", () => {  
 const marks: CricketScore[] = [
    {
      marks: {
        "15": 0,
        "16": 0,
        "17": 0,
        "18": 0,
        "19": 0,
        "20": 3,
        "25": 0,
      },
      score: 20,
      joueur: {
        id: 1,
        nom: "Matthieu",
        color: {
          h: 0,
          s: 0,
          l: 0,
        },
      },
    },
    {
      marks: {
        "15": 0,
        "16": 0,
        "17": 0,
        "18": 0,
        "19": 0,
        "20": 3,
        "25": 0,
      },
      score: 0,
      joueur: {
        id: 2,
        nom: "Celia",
        color: {
          h: 0,
          s: 0,
          l: 0,
        },
      },
    },
  ]
  expect(isOpenForEveryone(marks, 20)).toBe(true);
});


test("prod missing current player", () => {
  const game : Game<Game_Type.CRICKET> = {
    status: 2,
    throws: [],
    scores: [
      {
        marks: {
          "15": 0,
          "16": 0,
          "17": 0,
          "18": 0,
          "19": 0,
          "20": 0,
          "25": 0,
        },
        score: 0,
        joueur: {
          id: 1,
          nom: "Matthieu",
          color: {
            h: 205.9,
            s: 99.1,
            l: 45.3,
          },
        },
      },
      {
        marks: {
          15: 0,
          16: 0,
          17: 0,
          18: 0,
          19: 0,
          20: 0,
          25: 0,
        },
        score: 0,
        joueur: {
          id: 2,
          nom: "Célia",
          color: {
            h: 54,
            s: 99,
            l: 45,
          },
        },
      },
    ]as CricketScore[],
    dart_count: 3,
    players: [
      {
        id: 1,
        nom: "Matthieu",
        color: {
          h: 0,
          s: 0,
          l: 0,
        },
      },
      {
        id: 2,
        nom: "Célia",
        color: {
          h: 54,
          s: 99,
          l: 45,
        },
      },
    ],
  };

  const throws: DartThrow[] = [
    {
      player: {
        id: 1,
        nom: "Matthieu",
        color: {
          h: 205.9,
          s: 99.1,
          l: 45.3,
        },
      },
      value: 20,
      ring: 1,
      date: new Date("2025-02-15T17:05:24.453Z"),
    },
  ];
  const updatedGame = throws.reduce(cricketReduce, game);
  expect(updatedGame.dart_count).toBe(2);
  expect(updatedGame.current_player?.nom).toBe('Matthieu');
  expect((updatedGame.scores[0] as CricketScore).marks[20]).toBe(1);
});
