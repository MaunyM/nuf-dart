const base_api = process.env.NEXT_PUBLIC_API;

export type PlayerColor = { h: number; s: number; l: number };

export const PALETTE: { h: number; s: number; l: number; name: string }[] = [
  { h: 10,  s: 99, l: 45, name: "Rouge" },
  { h: 25,  s: 90, l: 42, name: "Brun-doré" },
  { h: 38,  s: 99, l: 45, name: "Orange" },
  { h: 54,  s: 99, l: 45, name: "Jaune" },
  { h: 88,  s: 75, l: 40, name: "Vert lime" },
  { h: 145, s: 99, l: 30, name: "Vert" },
  { h: 180, s: 90, l: 40, name: "Turquoise" },
  { h: 206, s: 99, l: 45, name: "Bleu ciel" },
  { h: 225, s: 85, l: 48, name: "Bleu roi" },
  { h: 271, s: 76, l: 53, name: "Violet" },
  { h: 300, s: 76, l: 72, name: "Rose" },
  { h: 335, s: 85, l: 52, name: "Framboise" },
];

export async function createPlayer(
  nom: string,
  color: PlayerColor,
  token: string
): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch(`${base_api}/player`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: token },
    body: JSON.stringify({ nom, color }),
  });
  if (res.status === 201) return { ok: true };
  const body = await res.json().catch(() => ({}));
  return { ok: false, error: body.error ?? "unknown_error" };
}

export async function updatePlayer(
  id: string,
  fields: { nom?: string; color?: PlayerColor },
  token: string
): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch(`${base_api}/player/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: token },
    body: JSON.stringify(fields),
  });
  if (res.status === 200) return { ok: true };
  const body = await res.json().catch(() => ({}));
  return { ok: false, error: body.error ?? "unknown_error" };
}
