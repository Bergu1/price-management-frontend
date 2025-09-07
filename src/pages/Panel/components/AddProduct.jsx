import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../../components/Navbar/Navbar";
import { createProduct } from "../api/products";
import "../styles/panel.css";

export default function AddProduct() {
  const token = localStorage.getItem("token");
  const isEmployee = JSON.parse(localStorage.getItem("isEmployee") || localStorage.getItem("is_employee") || "false");
  const nav = useNavigate();

  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [f, setF] = useState({
    name: "",
    description: "",
    country_of_origin: "",
    price1: "",
    picture: null,
  });

  const submit = async (e) => {
    e.preventDefault();
    try {
      setBusy(true); setErr("");
      const form = new FormData();
      Object.entries(f).forEach(([k, v]) => {
        if (v !== null && v !== undefined && v !== "") form.append(k, v);
      });
      await createProduct(form);
      nav("/panel");
    } catch (e2) {
      setErr(e2.response?.data ? JSON.stringify(e2.response.data) : e2.message);
    } finally { setBusy(false); }
  };

  return (
    <>
      <Navbar token={token} isEmployee={isEmployee} />
      <div className="pm">
        <div className="pm-container">
          <div className="pm-toolbar">
            <Link to="/panel" className="pm-btn">← Wróć do panelu</Link>
          </div>

          <div className="pm-card" style={{ marginTop: 16 }}>
            <div className="pm-card-header"><div className="pm-card-title">Dodaj produkt</div></div>
            {err && <div className="pm-muted" style={{ padding: 16 }}>Błąd: {err}</div>}

            <form onSubmit={submit} className="pm-form-grid" style={{ padding: 16 }}>
              <label className="pm-field">
                <span>Nazwa</span>
                <input className="pm-input" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} required />
              </label>

              <label className="pm-field">
                <span>Opis</span>
                <textarea className="pm-input" value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} />
              </label>

              <label className="pm-field">
                <span>Kraj pochodzenia</span>
                <input className="pm-input" value={f.country_of_origin} onChange={(e) => setF({ ...f, country_of_origin: e.target.value })} />
              </label>

              <label className="pm-field">
                <span>Cena</span>
                <input className="pm-input" type="number" step="0.01" value={f.price1} onChange={(e) => setF({ ...f, price1: e.target.value })} required />
              </label>

              <label className="pm-field">
                <span>Zdjęcie</span>
                <input className="pm-input" type="file" accept="image/*" onChange={(e) => setF({ ...f, picture: e.target.files?.[0] ?? null })} />
              </label>

              <div className="pm-actions-right">
                <button type="submit" className="pm-btn primary" disabled={busy}>
                  {busy ? "Dodaję…" : "Dodaj produkt"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
