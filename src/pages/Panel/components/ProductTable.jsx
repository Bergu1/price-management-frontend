// src/pages/Panel.jsx
import React, { useEffect, useRef, useState } from "react";
import { patchProduct, deleteProduct } from "../api/products";
import "../styles/panel.css";

/* -------------------- ustawienia -------------------- */
const DEBUG = true;

const THRESHOLDS = {
  distance: { near: 180, mid: 400 }, // mm
  weight: { low: 100, available: 1000 }, // g
};

/* -------------------- helpery -------------------- */
const toNumber = (v) => {
  if (v == null) return NaN;
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    const cleaned = v.replace(",", ".");
    const m = cleaned.match(/-?\d+(\.\d+)?/);
    return m ? Number(m[0]) : NaN;
  }
  return NaN;
};

/* -------------------- logika dostępności -------------------- */
const computeAvailability = (row) => {
  if (DEBUG) console.log("computeAvailability input:", row);
  const shelf = Number(row?.shelf_number ?? 0);

  if (shelf === 3) {
    const w = toNumber(row?.weight_g);

    if (!Number.isFinite(w) || w < THRESHOLDS.weight.low) {
      return { label: "Niedostępny", cls: "bad", via: `waga ${Number.isFinite(w) ? w.toFixed(0) : 0} g` };
    }

    if (w < THRESHOLDS.weight.available) {
      return { label: "Ostatnie sztuki", cls: "warn", via: `waga ${w.toFixed(0)} g` };
    }

    return { label: "Dostępny", cls: "ok", via: `waga ${w.toFixed(0)} g` };
  }


  if (shelf === 1 || shelf === 2) {
    const d = toNumber(shelf === 1 ? row?.d1_mm : row?.d2_mm);
    if (!Number.isFinite(d)) return { label: "Niedostępny", cls: "bad", via: "brak pomiaru" };
    if (d < THRESHOLDS.distance.near) return { label: "Dostępny", cls: "ok", via: `odległość ${d} mm` };
    if (d < THRESHOLDS.distance.mid) return { label: "Ostatnie sztuki", cls: "warn", via: `odległość ${d} mm` };
    return { label: "Niedostępny", cls: "bad", via: `odległość ${d} mm` };
  }

  return { label: "Niedostępny", cls: "bad", via: "półka nieustawiona" };
};

/* -------------------- TABELA -------------------- */
function ProductTable({ rows, onUpdated, loading }) {
  const [drafts, setDrafts] = useState({});
  const [busy, setBusy] = useState({ save: null, del: null, setPrice: null });

  const setDraft = (id, patch) =>
    setDrafts((d) => ({ ...d, [id]: { ...(d[id] ?? {}), ...patch } }));

  const round2 = (v) => Number.parseFloat(v).toFixed(2);

  const save = async (id) => {
    setBusy((b) => ({ ...b, save: id }));
    try {
      const body = { ...drafts[id] };
      delete body.availability;
      delete body._mode;
      delete body._delta;

      const shelf = Number(drafts[id]?.shelf ?? rows.find((r) => r.id === id)?.shelf_number ?? 1);
      body.shelf = shelf;

      await patchProduct(id, body);
      setDrafts((d) => {
        const c = { ...d };
        delete c[id];
        return c;
      });
      onUpdated?.();
    } finally {
      setBusy((b) => ({ ...b, save: null }));
    }
  };

  const removeRow = async (id) => {
    if (!confirm("Usunąć produkt?")) return;
    setBusy((b) => ({ ...b, del: id }));
    try {
      await deleteProduct(id);
      onUpdated?.();
    } finally {
      setBusy((b) => ({ ...b, del: null }));
    }
  };

  const applyPriceChange = async (id) => {
    setBusy((b) => ({ ...b, setPrice: id }));
    try {
      const row = rows.find((r) => r.id === id);
      const base = Number(drafts[id]?.price1 ?? row?.price1 ?? 0);
      const mode = drafts[id]?._mode ?? "pct";
      const delta = Number(drafts[id]?._delta);
      if (!Number.isFinite(delta)) return;

      let next = base;
      if (mode === "pct") next = (base * (100 - delta)) / 100;
      else next = base - delta;

      next = Math.max(0, Number(next));

      const shelf = Number(drafts[id]?.shelf ?? row?.shelf_number ?? 1);
      await patchProduct(id, { price1: round2(next), shelf });
      setDrafts((d) => ({
        ...d,
        [id]: { ...(d[id] ?? {}), _delta: "", price1: round2(next), shelf },
      }));
      onUpdated?.();
    } finally {
      setBusy((b) => ({ ...b, setPrice: null }));
    }
  };

  return (
    <div className="pm-card">
      <div className="pm-card-header">
        <div className="pm-card-title">Produkty</div>
      </div>

      {loading ? (
        <div className="pm-muted" style={{ padding: 16 }}>Wczytywanie…</div>
      ) : (
        <div className="pm-table-wrap">
          <table className="pm-table">
            <thead>
              <tr>
                <th className="pm-col-thumb"></th>
                <th className="pm-col-name">Nazwa</th>
                <th className="pm-col-price">Cena</th>
                <th className="pm-col-change">Zmiana ceny</th>
                <th className="pm-col-country">Kraj</th>
                <th className="pm-col-avail">Dostępność</th>
                <th className="pm-col-shelf">Półka</th>
                <th className="pm-col-actions">Akcje</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                if (DEBUG) console.log("Produkt:", r);
                const mode = drafts[r.id]?._mode ?? "pct";
                const shelfDraft = Number(drafts[r.id]?.shelf ?? r.shelf_number ?? 1);
                const av = computeAvailability({ ...r, shelf_number: shelfDraft });

                return (
                  <tr key={r.id}>
                    <td>
                      <div className="pm-thumb">
                        {r.picture ? <img src={r.picture} alt={r.name} /> : <div className="pm-thumb-placeholder">no img</div>}
                      </div>
                    </td>

                    <td>
                      <input
                        className="pm-control"
                        value={(drafts[r.id]?.name ?? r.name) || ""}
                        onChange={(e) => setDraft(r.id, { name: e.target.value })}
                      />
                    </td>

                    <td>
                      <div className="pm-price-cell">
                        <span className="pm-price-prefix">zł</span>
                        <input
                          className="pm-control"
                          type="number"
                          step="0.01"
                          value={(drafts[r.id]?.price1 ?? r.price1) ?? ""}
                          onChange={(e) => setDraft(r.id, { price1: e.target.value })}
                        />
                      </div>
                    </td>

                    <td>
                      <div className="pm-change-wrap">
                        <div className="pm-segment" role="tablist" aria-label="Tryb zmiany ceny">
                          <button
                            className={mode === "pct" ? "active" : ""}
                            onClick={() => setDraft(r.id, { _mode: "pct" })}
                            aria-pressed={mode === "pct"}
                            title="Procent"
                          >
                            %
                          </button>
                          <button
                            className={mode === "amt" ? "active" : ""}
                            onClick={() => setDraft(r.id, { _mode: "amt" })}
                            aria-pressed={mode === "amt"}
                            title="Kwota"
                          >
                            zł
                          </button>
                        </div>
                        <input
                          className="pm-control sm"
                          type="number"
                          step="0.01"
                          placeholder={mode === "pct" ? "np. 10" : "np. 1.50"}
                          value={drafts[r.id]?._delta ?? ""}
                          onChange={(e) => setDraft(r.id, { _delta: e.target.value })}
                        />
                        <button
                          className="pm-btn sm ok"
                          disabled={busy.setPrice === r.id}
                          onClick={() => applyPriceChange(r.id)}
                        >
                          Ustaw
                        </button>
                      </div>
                    </td>

                    <td>
                      <input
                        className="pm-control"
                        value={(drafts[r.id]?.country_of_origin ?? r.country_of_origin) || ""}
                        onChange={(e) => setDraft(r.id, { country_of_origin: e.target.value })}
                      />
                    </td>

                    <td title={av.via}>
                      <span className={`pm-badge ${av.cls}`}>{av.label}</span>
                    </td>

                    <td>
                      <select
                        className="pm-control pm-select-shelf"
                        value={shelfDraft}
                        onChange={(e) => setDraft(r.id, { shelf: Number(e.target.value) })}
                        title="Numer półki"
                      >
                        <option value={1}>Półka 1</option>
                        <option value={2}>Półka 2</option>
                        <option value={3}>Półka 3</option>
                      </select>
                    </td>

                    <td>
                      <div className="pm-row-actions">
                        <button className="pm-btn" disabled={busy.save === r.id} onClick={() => save(r.id)}>
                          {busy.save === r.id ? "Zapisywanie…" : "Zapisz"}
                        </button>
                        <button className="pm-btn danger" disabled={busy.del === r.id} onClick={() => removeRow(r.id)}>
                          Usuń
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={8} className="pm-muted" style={{ textAlign: "center", padding: 16 }}>
                    Brak produktów.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* -------------------- Polling + wrapper -------------------- */
async function fetchProducts() {
  const res = await fetch(`/api/products/product_view/`, {
    headers: { Accept: "application/json", "Cache-Control": "no-cache" },
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`HTTP ${res.status} ${res.statusText} — ${txt.slice(0, 120)}`);
  }
  return res.json();
}

export default function Panel() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const tRef = useRef(null);
  const clear = () => { if (tRef.current) clearTimeout(tRef.current); };

  const load = async () => {
    try {
      const data = await fetchProducts();
      setRows(data);
      setError(null);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
      tRef.current = setTimeout(() => {
        if (document.visibilityState === "hidden") return load();
        load();
      }, 3000);
    }
  };

  useEffect(() => {
    load();
    const onVis = () => {
      if (document.visibilityState === "visible") {
        clear();
        setLoading(true);
        load();
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refetch = () => { clear(); setLoading(true); load(); };

  return (
    <>
      {/* Pasek tytułu NAD wszystkim (fixed), nie zależy od DOM toolbara */}
      <div className="pm-titlebar">
        <h1>Panel pracownika</h1>
      </div>

      {/* Reszta strony */}
      <div className="pm-container">
        {error && <div style={{ color: "crimson" }}>Błąd: {String(error)}</div>}
        <ProductTable rows={rows} loading={loading} onUpdated={refetch} />
      </div>
    </>
  );
}
