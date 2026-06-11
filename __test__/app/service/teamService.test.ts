import { expect, test } from "vitest";
import { Joueur, Team } from "@/app/Type/Game";
import { MonsterScore } from "@/app/Type/Monster";
import {
  interleaveByTeam,
  updateTeamScore,
  validateTeams,
} from "@/app/service/teamService";

const a1: Joueur = { id: 1, nom: "A1", color: { h: 0, s: 0, l: 0 } };
const a2: Joueur = { id: 2, nom: "A2", color: { h: 0, s: 0, l: 0 } };
const b1: Joueur = { id: 3, nom: "B1", color: { h: 0, s: 0, l: 0 } };
const b2: Joueur = { id: 4, nom: "B2", color: { h: 0, s: 0, l: 0 } };
const b3: Joueur = { id: 5, nom: "B3", color: { h: 0, s: 0, l: 0 } };

test("validateTeams renvoie true pour 4 joueurs répartis en 2 équipes de 2", () => {
  const teams: Team[] = [
    { id: 1, name: "Équipe 1", players: [a1, a2] },
    { id: 2, name: "Équipe 2", players: [b1, b2] },
  ];
  expect(validateTeams(teams, [a1, a2, b1, b2])).toBe(true);
});

test("validateTeams renvoie false si un joueur sélectionné n'est affecté à aucune équipe", () => {
  const teams: Team[] = [
    { id: 1, name: "Équipe 1", players: [a1, a2] },
    { id: 2, name: "Équipe 2", players: [b1] },
  ];
  expect(validateTeams(teams, [a1, a2, b1, b2])).toBe(false);
});

test("validateTeams renvoie false s'il n'existe qu'une seule équipe non vide", () => {
  const teams: Team[] = [
    { id: 1, name: "Équipe 1", players: [a1, a2, b1, b2] },
    { id: 2, name: "Équipe 2", players: [] },
  ];
  expect(validateTeams(teams, [a1, a2, b1, b2])).toBe(false);
});

test("validateTeams renvoie false si une équipe ne compte qu'un seul joueur", () => {
  const teams: Team[] = [
    { id: 1, name: "Équipe 1", players: [a1] },
    { id: 2, name: "Équipe 2", players: [a2, b1, b2] },
  ];
  expect(validateTeams(teams, [a1, a2, b1, b2])).toBe(false);
});

test("interleaveByTeam alterne strictement entre 2 équipes de 2", () => {
  const teams: Team[] = [
    { id: 1, name: "Équipe 1", players: [a1, a2] },
    { id: 2, name: "Équipe 2", players: [b1, b2] },
  ];
  expect(interleaveByTeam(teams)).toEqual([a1, b1, a2, b2]);
});

test("interleaveByTeam gère des effectifs inégaux (2 vs 3) sans perdre de joueur", () => {
  const teams: Team[] = [
    { id: 1, name: "Équipe 1", players: [a1, a2] },
    { id: 2, name: "Équipe 2", players: [b1, b2, b3] },
  ];
  const ordered = interleaveByTeam(teams);
  expect(ordered).toEqual([a1, b1, a2, b2, b3]);
  expect(ordered.length).toBe(teams.flatMap((t) => t.players).length);
});

test("updateTeamScore applique le soin (+1) plafonné à maxScore pour toute l'équipe", () => {
  const scores = [
    new MonsterScore(a1, undefined, 1, 20),
    new MonsterScore(a2, undefined, 1, 20),
    new MonsterScore(b1, undefined, 2, 20),
  ];
  scores[0].score = 20;
  scores[1].score = 20;

  const updated = updateTeamScore(scores, 1, +1, 20);
  expect(updated[0].score).toBe(20);
  expect(updated[1].score).toBe(20);
  expect(updated[2].score).toBe(20);
});

test("updateTeamScore applique l'attaque (-1) plancher à 0 pour toute l'équipe", () => {
  const scores = [
    new MonsterScore(a1, undefined, 1, 20),
    new MonsterScore(a2, undefined, 1, 20),
  ];
  scores[0].score = 0;
  scores[1].score = 0;

  const updated = updateTeamScore(scores, 1, -1, 20);
  expect(updated[0].score).toBe(0);
  expect(updated[1].score).toBe(0);
});

test("updateTeamScore ne modifie que les MonsterScore du teamId ciblé", () => {
  const scores = [
    new MonsterScore(a1, undefined, 1, 20),
    new MonsterScore(b1, undefined, 2, 20),
  ];

  const updated = updateTeamScore(scores, 1, -1, 20);
  expect(updated[0].score).toBe(19);
  expect(updated[1].score).toBe(20);
  expect(updated[1]).toBe(scores[1]);
});
