import { expect, test } from "vitest";
import {
  getPlayerPerformanceHistory,
  getPerformanceUnit,
} from "../../../app/service/performanceService";
import { DartThrow, Game_Type, Joueur, Ring } from "@/app/Type/Game";

const matthieu: Joueur = {
  id: 1,
  nom: "Matthieu",
  color: { h: 0, s: 0, l: 0 },
};

const celia: Joueur = {
  id: 2,
  nom: "Celia",
  color: { h: 0, s: 0, l: 0 },
};

function dartThrow(
  player: Joueur,
  value: number,
  ring: Ring,
  targetZones?: number[]
): DartThrow {
  return { player, value, ring, date: new Date(), targetZones };
}

test("Aucun lancer renvoie un historique vide", () => {
  expect(getPlayerPerformanceHistory([], matthieu, Game_Type.X01)).toEqual([]);
});

test("Un tour incomplet (1 ou 2 lancers) ne produit aucune valeur", () => {
  const throws = [
    dartThrow(matthieu, 20, Ring.SIMPLE_TOP),
    dartThrow(matthieu, 19, Ring.SIMPLE_TOP),
  ];
  expect(getPlayerPerformanceHistory(throws, matthieu, Game_Type.X01)).toEqual([]);
});

test("Seuls les lancers du joueur concerné sont pris en compte (FR-006)", () => {
  const throws = [
    dartThrow(matthieu, 20, Ring.SIMPLE_TOP),
    dartThrow(celia, 5, Ring.SIMPLE_TOP),
    dartThrow(matthieu, 20, Ring.SIMPLE_TOP),
    dartThrow(celia, 5, Ring.SIMPLE_TOP),
    dartThrow(matthieu, 20, Ring.SIMPLE_TOP),
    dartThrow(celia, 5, Ring.SIMPLE_TOP),
  ];
  expect(getPlayerPerformanceHistory(throws, matthieu, Game_Type.X01)).toEqual([20]);
  expect(getPlayerPerformanceHistory(throws, celia, Game_Type.X01)).toEqual([5]);
});

test("getPerformanceUnit retourne le bon libellé pour chaque type de jeu (FR-010)", () => {
  expect(getPerformanceUnit(Game_Type.X01)).toEqual("pts/volée");
  expect(getPerformanceUnit(Game_Type.CRICKET)).toEqual("marques/volée");
  expect(getPerformanceUnit(Game_Type.MONSTER)).toEqual("zones/3");
});

test("Game_Type.X01 : un tour complet (3 lancers) produit la moyenne de points par tour", () => {
  const throws = [
    dartThrow(matthieu, 20, Ring.SIMPLE_TOP),
    dartThrow(matthieu, 20, Ring.SIMPLE_TOP),
    dartThrow(matthieu, 20, Ring.SIMPLE_TOP),
  ];
  expect(getPlayerPerformanceHistory(throws, matthieu, Game_Type.X01)).toEqual([20]);
});

test("Game_Type.X01 : un lancer manqué (value: 0) est compté comme 0 point", () => {
  const throws = [
    dartThrow(matthieu, 0, Ring.SIMPLE_TOP),
    dartThrow(matthieu, 20, Ring.SIMPLE_TOP),
    dartThrow(matthieu, 19, Ring.SIMPLE_TOP),
  ];
  expect(getPlayerPerformanceHistory(throws, matthieu, Game_Type.X01)).toEqual([13]);
});

test("Game_Type.X01 : les multiplicateurs de zone sont appliqués (TRIPLE, DOUBLE, BULL)", () => {
  const throws = [
    dartThrow(matthieu, 20, Ring.TRIPLE),
    dartThrow(matthieu, 20, Ring.DOUBLE),
    dartThrow(matthieu, 25, Ring.BULL),
  ];
  // (20*3 + 20*2 + 25*1) / 3 = (60 + 40 + 25) / 3
  expect(getPlayerPerformanceHistory(throws, matthieu, Game_Type.X01)).toEqual([125 / 3]);
});

test("Game_Type.X01 : au-delà de 5 tours complétés, seules les 5 valeurs les plus récentes sont conservées (FR-009)", () => {
  const throws: DartThrow[] = [];
  // 6 tours de 3 lancers, valeur croissante par tour : 1,1,1 / 2,2,2 / ... / 6,6,6
  for (let tour = 1; tour <= 6; tour++) {
    for (let i = 0; i < 3; i++) {
      throws.push(dartThrow(matthieu, tour, Ring.SIMPLE_TOP));
    }
  }
  expect(getPlayerPerformanceHistory(throws, matthieu, Game_Type.X01)).toEqual([2, 3, 4, 5, 6]);
});

test("Game_Type.CRICKET : un tour sur des zones cricket calcule le MPR (somme des multiplicateurs)", () => {
  const throws = [
    dartThrow(matthieu, 20, Ring.TRIPLE),
    dartThrow(matthieu, 19, Ring.SIMPLE_TOP),
    dartThrow(matthieu, 18, Ring.DOUBLE),
  ];
  // 3 + 1 + 2 = 6
  expect(getPlayerPerformanceHistory(throws, matthieu, Game_Type.CRICKET)).toEqual([6]);
});

test("Game_Type.CRICKET : les lancers hors zones cricket contribuent 0", () => {
  const throws = [
    dartThrow(matthieu, 1, Ring.SIMPLE_TOP),
    dartThrow(matthieu, 2, Ring.TRIPLE),
    dartThrow(matthieu, 3, Ring.DOUBLE),
  ];
  expect(getPlayerPerformanceHistory(throws, matthieu, Game_Type.CRICKET)).toEqual([0]);
});

test("Game_Type.CRICKET : le bull (25) est compté comme une zone cricket", () => {
  const throws = [
    dartThrow(matthieu, 25, Ring.BULL),
    dartThrow(matthieu, 1, Ring.SIMPLE_TOP),
    dartThrow(matthieu, 1, Ring.SIMPLE_TOP),
  ];
  expect(getPlayerPerformanceHistory(throws, matthieu, Game_Type.CRICKET)).toEqual([1]);
});

test("Game_Type.MONSTER : compte le nombre de lancers ayant touché une zone assignée", () => {
  const throws = [
    dartThrow(matthieu, 6, Ring.SIMPLE_TOP, [6, 10, 15]),
    dartThrow(matthieu, 10, Ring.SIMPLE_TOP, [6, 10, 15]),
    dartThrow(matthieu, 1, Ring.SIMPLE_TOP, [6, 10, 15]),
  ];
  expect(getPlayerPerformanceHistory(throws, matthieu, Game_Type.MONSTER)).toEqual([2]);
});

test("Game_Type.MONSTER : un lancer sans targetZones défini ne compte pour aucune réussite", () => {
  const throws = [
    dartThrow(matthieu, 6, Ring.SIMPLE_TOP, [6, 10, 15]),
    dartThrow(matthieu, 10, Ring.SIMPLE_TOP),
    dartThrow(matthieu, 15, Ring.SIMPLE_TOP, [6, 10, 15]),
  ];
  expect(getPlayerPerformanceHistory(throws, matthieu, Game_Type.MONSTER)).toEqual([2]);
});

test("Game_Type.MONSTER : aucune zone touchée sur la volée renvoie 0", () => {
  const throws = [
    dartThrow(matthieu, 1, Ring.SIMPLE_TOP, [6, 10, 15]),
    dartThrow(matthieu, 2, Ring.SIMPLE_TOP, [6, 10, 15]),
    dartThrow(matthieu, 3, Ring.SIMPLE_TOP, [6, 10, 15]),
  ];
  expect(getPlayerPerformanceHistory(throws, matthieu, Game_Type.MONSTER)).toEqual([0]);
});
