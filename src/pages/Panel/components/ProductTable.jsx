import React, { useState } from "react";
import { patchProduct, deleteProduct } from "../api/products";
import "../styles/panel.css";

const labelAvailability = (v) => {
  if (typeof v === "string" && v.trim()) return v;
  const n = Number(v);
  if (!Number.isFinite(n)) return "-";
  if (n <= 0) return "niedostępny";
  if (n < 5) return "trochę dostępny";
  return "dostępny";
};

export default function ProductTable({ rows, onUpdated, loading }) {
  const [drafts, setDrafts] = useState({});
  const [busy, setBusy] = useState({ save: null, del: null, setPrice: null });

  const setDraft = (id, patch) =>
    setDrafts((d) => ({ ...d, [id]: { ...(d[id] ?? {}), ...patch } }));

  const round2 = (v) => Number.parseFloat(v).toFixed(2);

  const save = async (id) => {
    setBusy((b) => ({ ...b, save: id }));
    try {
      const body = { ...drafts[id] };
      // wyczyść pola pomocnicze
      delete body.availability;
      delete body._mode;
      delete body._delta;

      // półka: jeżeli nie wybrano, domyślnie 1
      const shelf = Number(drafts[id]?.shelf ?? 1);
      body.shelf = shelf;

      await patchProduct(id, body); // backend odczyta shelf z body
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
      const shelf = Number(drafts[id]?.shelf ?? 1);

      await patchProduct(id, { price1: round2(next), shelf }); // ważne: przekazujemy shelf
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
        <div className="pm-muted" style={{ padding: 16 }}>
          Wczytywanie…
        </div>
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
                <th style={{ width: 120 }}>Półka</th>
                <th className="pm-col-actions">Akcje</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const mode = drafts[r.id]?._mode ?? "pct";
                const shelf = Number(drafts[r.id]?.shelf ?? 1);

                return (
                  <tr key={r.id}>
                    <td>
                      <div className="pm-thumb">
                        {r.picture ? (
                          <img src={r.picture} alt={r.name} />
                        ) : (
                          <div className="pm-thumb-placeholder">no img</div>
                        )}
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
                        <div
                          className="pm-segment"
                          role="tablist"
                          aria-label="Tryb zmiany ceny"
                        >
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
                        value={
                          (drafts[r.id]?.country_of_origin ?? r.country_of_origin) ||
                          ""
                        }
                        onChange={(e) =>
                          setDraft(r.id, { country_of_origin: e.target.value })
                        }
                      />
                    </td>

                    <td>
                      <span className="pm-muted">
                        {labelAvailability(r.availability)}
                      </span>
                    </td>

                    <td>
                      <select
                        className="pm-control"
                        value={shelf}
                        onChange={(e) =>
                          setDraft(r.id, { shelf: Number(e.target.value) })
                        }
                        title="Numer półki"
                      >
                        <option value={1}>Półka 1</option>
                        <option value={2}>Półka 2</option>
                        <option value={3}>Półka 3</option>
                      </select>
                    </td>

                    <td>
                      <div className="pm-row-actions">
                        <button
                          className="pm-btn"
                          disabled={busy.save === r.id}
                          onClick={() => save(r.id)}
                        >
                          {busy.save === r.id ? "Zapisywanie…" : "Zapisz"}
                        </button>
                        <button
                          className="pm-btn danger"
                          disabled={busy.del === r.id}
                          onClick={() => removeRow(r.id)}
                        >
                          Usuń
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {rows.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="pm-muted"
                    style={{ textAlign: "center", padding: 16 }}
                  >
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
