import { expect, test } from "vitest";
import { getPlayerPerformanceHistory } from "../../../app/service/performanceService";
import { DartThrow, Joueur, Ring } from "@/app/Type/Game";

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

function dartThrow(player: Joueur, value: number, ring: Ring): DartThrow {
  return { player, value, ring, date: new Date() };
}

test("Aucun lancer renvoie un historique vide", () => {
  expect(getPlayerPerformanceHistory([], matthieu)).toEqual([]);
});

test("Un tour incomplet (1 ou 2 lancers) ne produit aucune valeur", () => {
  const throws = [
    dartThrow(matthieu, 20, Ring.SIMPLE_TOP),
    dartThrow(matthieu, 19, Ring.SIMPLE_TOP),
  ];
  expect(getPlayerPerformanceHistory(throws, matthieu)).toEqual([]);
});

test("Un tour complet (3 lancers) produit la moyenne de points par tour", () => {
  const throws = [
    dartThrow(matthieu, 20, Ring.SIMPLE_TOP),
    dartThrow(matthieu, 20, Ring.SIMPLE_TOP),
    dartThrow(matthieu, 20, Ring.SIMPLE_TOP),
  ];
  expect(getPlayerPerformanceHistory(throws, matthieu)).toEqual([20]);
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
  expect(getPlayerPerformanceHistory(throws, matthieu)).toEqual([20]);
  expect(getPlayerPerformanceHistory(throws, celia)).toEqual([5]);
});

test("Un lancer manqué (value: 0) est compté comme 0 point", () => {
  const throws = [
    dartThrow(matthieu, 0, Ring.SIMPLE_TOP),
    dartThrow(matthieu, 20, Ring.SIMPLE_TOP),
    dartThrow(matthieu, 19, Ring.SIMPLE_TOP),
  ];
  expect(getPlayerPerformanceHistory(throws, matthieu)).toEqual([13]);
});

test("Les multiplicateurs de zone sont appliqués (TRIPLE, DOUBLE, BULL)", () => {
  const throws = [
    dartThrow(matthieu, 20, Ring.TRIPLE),
    dartThrow(matthieu, 20, Ring.DOUBLE),
    dartThrow(matthieu, 25, Ring.BULL),
  ];
  // (20*3 + 20*2 + 25*1) / 3 = (60 + 40 + 25) / 3
  expect(getPlayerPerformanceHistory(throws, matthieu)).toEqual([125 / 3]);
});

test("Au-delà de 5 tours complétés, seules les 5 valeurs les plus récentes sont conservées (FR-009)", () => {
  const throws: DartThrow[] = [];
  // 6 tours de 3 lancers, valeur croissante par tour : 1,1,1 / 2,2,2 / ... / 6,6,6
  for (let tour = 1; tour <= 6; tour++) {
    for (let i = 0; i < 3; i++) {
      throws.push(dartThrow(matthieu, tour, Ring.SIMPLE_TOP));
    }
  }
  expect(getPlayerPerformanceHistory(throws, matthieu)).toEqual([2, 3, 4, 5, 6]);
});
