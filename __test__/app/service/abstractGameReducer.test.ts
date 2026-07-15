import { expect, test } from "vitest";
import { abstractGameReducer, AbstractGameState, initialAbstractGameState } from "../../../app/service/abstractGameService";
import { DartThrow, Game, Game_State, Joueur, Ring } from "@/app/Type/Game";

const alice: Joueur = { id: 1, nom: "Alice", color: { h: 0, s: 0, l: 0 } };
const bob: Joueur = { id: 2, nom: "Bob", color: { h: 0, s: 0, l: 0 } };

const aDart: DartThrow = { player: alice, value: 20, ring: Ring.SIMPLE_TOP, date: new Date() };

const startingGame: Game = {
  status: Game_State.THROWING,
  throws: [],
  scores: [],
  dart_count: 3,
  players: [alice, bob],
  round: 0,
  current_player: alice,
};

const stateWithGame: AbstractGameState = {
  ...initialAbstractGameState,
  startingGame,
  game: startingGame,
};

const wonReducer = (_game: Game, _throw: DartThrow): Game => ({
  ...startingGame,
  status: Game_State.WON,
  current_player: alice,
});

const throwingReducer = (_game: Game, _throw: DartThrow): Game => ({
  ...startingGame,
  status: Game_State.THROWING,
});

test("ADD_THROW avec seriesTarget=1 ne comptabilise pas les victoires", () => {
  const next = abstractGameReducer(stateWithGame, {
    type: 'ADD_THROW',
    throw: aDart,
    seriesTarget: 1,
    gameReducer: wonReducer,
  });
  expect(next.wins).toEqual({});
  expect(next.seriesWinner).toBeUndefined();
});

test("ADD_THROW avec seriesTarget=3 comptabilise la victoire sans désigner de champion", () => {
  const next = abstractGameReducer(stateWithGame, {
    type: 'ADD_THROW',
    throw: aDart,
    seriesTarget: 3,
    gameReducer: wonReducer,
  });
  expect(next.wins[alice.id]).toBe(1);
  expect(next.seriesWinner).toBeUndefined();
});

test("ADD_THROW désigne le champion quand le joueur atteint ceil(seriesTarget/2) victoires", () => {
  const stateAfterFirstWin: AbstractGameState = {
    ...stateWithGame,
    wins: { [alice.id]: 1 },
  };
  const next = abstractGameReducer(stateAfterFirstWin, {
    type: 'ADD_THROW',
    throw: aDart,
    seriesTarget: 3,
    gameReducer: wonReducer,
  });
  expect(next.wins[alice.id]).toBe(2);
  expect(next.seriesWinner).toEqual(alice);
});

test("RESET_PLAYERS conserve les victoires (passage à la manche suivante)", () => {
  const stateWithWins: AbstractGameState = {
    ...stateWithGame,
    wins: { [alice.id]: 1 },
  };
  const next = abstractGameReducer(stateWithWins, {
    type: 'RESET_PLAYERS',
    startingGame,
  });
  expect(next.wins[alice.id]).toBe(1);
  expect(next.dartThrows).toEqual([]);
});

test("NEW_SERIES remet les victoires et le champion à zéro", () => {
  const stateWithWins: AbstractGameState = {
    ...stateWithGame,
    wins: { [alice.id]: 2 },
    seriesWinner: alice,
  };
  const next = abstractGameReducer(stateWithWins, { type: 'NEW_SERIES' });
  expect(next.wins).toEqual({});
  expect(next.seriesWinner).toBeUndefined();
});

test("ADD_THROW sans victoire ne modifie pas wins", () => {
  const next = abstractGameReducer(stateWithGame, {
    type: 'ADD_THROW',
    throw: aDart,
    seriesTarget: 3,
    gameReducer: throwingReducer,
  });
  expect(next.wins).toEqual({});
  expect(next.seriesWinner).toBeUndefined();
});
