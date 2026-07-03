import { useAuth } from "react-oidc-context";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { PALETTE, createPlayer, updatePlayer, PlayerColor } from "@/app/service/playerService";
import { JoueurWithElo } from "@/app/Type/Elo";

const base_api = process.env.NEXT_PUBLIC_API;
const fetcher = (url: string) => fetch(url).then((r) => r.json());

function hslStr(h: number, s: number, l: number) {
  return `hsl(${h}, ${s}%, ${l}%)`;
}

const ERROR_MESSAGES: Record<string, string> = {
  name_taken: "Ce nom est déjà utilisé.",
  invalid_input: "Nom invalide (max 10 caractères) ou couleur invalide.",
  not_found: "Joueur introuvable.",
  unknown_error: "Erreur inattendue.",
};

export default function ManagePlayers() {
  const auth = useAuth();
  const router = useRouter();

  const { data: players, mutate } = useSWR<JoueurWithElo[]>(
    `${base_api}/elo`,
    fetcher
  );

  const [nom, setNom] = useState("");
  const [selectedColor, setSelectedColor] = useState<PlayerColor | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      auth.signinRedirect();
    }
  }, [auth]);

  if (auth.isLoading || !auth.isAuthenticated) return null;

  const token = auth.user?.access_token ?? "";

  function selectPlayer(p: JoueurWithElo) {
    setEditingId(p.nom);
    setNom(p.nom);
    const palette = PALETTE.find((c) => c.h === Math.round(p.color.h));
    setSelectedColor(palette ?? { h: p.color.h, s: p.color.s, l: p.color.l });
    setFeedback(null);
  }

  function resetForm() {
    setEditingId(null);
    setNom("");
    setSelectedColor(null);
    setFeedback(null);
  }

  async function handleSubmit() {
    if (!nom.trim() || !selectedColor) return;
    setLoading(true);
    setFeedback(null);

    let result;
    if (editingId) {
      result = await updatePlayer(editingId, { nom: nom.trim(), color: selectedColor }, token);
    } else {
      result = await createPlayer(nom.trim(), selectedColor, token);
    }

    setLoading(false);
    if (result.ok) {
      setFeedback({ ok: true, msg: editingId ? "Joueur modifié !" : "Joueur créé !" });
      mutate();
      resetForm();
    } else {
      setFeedback({ ok: false, msg: ERROR_MESSAGES[result.error ?? ""] ?? ERROR_MESSAGES.unknown_error });
    }
  }

  const usedHues = new Set((players ?? []).map((p) => Math.round(p.color.h)));

  return (
    <div style={{ fontFamily: "sans-serif", maxWidth: 600, margin: "40px auto", padding: "0 20px" }}>
      <h1 style={{ fontSize: 24, marginBottom: 8 }}>Gérer les joueurs</h1>
      <button onClick={() => router.push("/")} style={{ marginBottom: 24, cursor: "pointer" }}>
        ← Retour
      </button>

      {/* Form */}
      <div style={{ background: "#f5f5f5", borderRadius: 8, padding: 20, marginBottom: 32 }}>
        <h2 style={{ fontSize: 18, marginBottom: 16 }}>
          {editingId ? `Modifier "${editingId}"` : "Créer un joueur"}
        </h2>

        <label style={{ display: "block", marginBottom: 12 }}>
          <span style={{ fontSize: 14, color: "#555" }}>Nom (max 10 caractères)</span>
          <input
            type="text"
            maxLength={10}
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            style={{ display: "block", marginTop: 4, padding: "8px 12px", fontSize: 16, borderRadius: 4, border: "1px solid #ccc", width: "100%" }}
            placeholder="Nom du joueur"
          />
        </label>

        <div style={{ marginBottom: 16 }}>
          <span style={{ fontSize: 14, color: "#555" }}>Couleur</span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
            {PALETTE.map((c) => {
              const isSelected = selectedColor?.h === c.h;
              const isUsed = usedHues.has(c.h) && c.h !== (editingId ? Math.round((players ?? []).find(p => p.nom === editingId)?.color.h ?? -1) : -1);
              return (
                <button
                  key={c.h}
                  title={`${c.name}${isUsed ? " (déjà utilisée)" : ""}`}
                  onClick={() => setSelectedColor({ h: c.h, s: c.s, l: c.l })}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: hslStr(c.h, c.s, c.l),
                    border: isSelected ? "3px solid #333" : "3px solid transparent",
                    cursor: "pointer",
                    outline: isUsed ? "2px dashed #aaa" : "none",
                    opacity: isUsed ? 0.7 : 1,
                  }}
                />
              );
            })}
          </div>
          {selectedColor && (
            <div style={{ marginTop: 6, fontSize: 13, color: "#555" }}>
              Sélectionné : {PALETTE.find((c) => c.h === selectedColor.h)?.name ?? "Personnalisé"}
            </div>
          )}
        </div>

        {feedback && (
          <div style={{ marginBottom: 12, padding: "8px 12px", borderRadius: 4, background: feedback.ok ? "#d4edda" : "#f8d7da", color: feedback.ok ? "#155724" : "#721c24", fontSize: 14 }}>
            {feedback.msg}
          </div>
        )}

        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={handleSubmit}
            disabled={!nom.trim() || !selectedColor || loading}
            style={{ padding: "10px 20px", background: "#333", color: "white", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 15, opacity: (!nom.trim() || !selectedColor || loading) ? 0.5 : 1 }}
          >
            {loading ? "…" : editingId ? "Modifier" : "Créer"}
          </button>
          {editingId && (
            <button onClick={resetForm} style={{ padding: "10px 20px", background: "#aaa", color: "white", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 15 }}>
              Annuler
            </button>
          )}
        </div>
      </div>

      {/* Player list */}
      <h2 style={{ fontSize: 18, marginBottom: 12 }}>Joueurs existants</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {(players ?? []).map((p) => (
          <button
            key={p.nom}
            onClick={() => selectPlayer(p)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 14px",
              background: editingId === p.nom ? "#e8f0fe" : "white",
              border: "1px solid #ddd",
              borderRadius: 6,
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: hslStr(p.color.h, p.color.s, p.color.l), flexShrink: 0 }} />
            <span style={{ fontSize: 16 }}>{p.nom}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
