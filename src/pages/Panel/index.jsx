import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { listProducts } from "./api/products";
import ProductTable from "./components/ProductTable";
import "./styles/panel.css";

export default function Panel() {
  const token = localStorage.getItem("token");
  const isEmployee = JSON.parse(localStorage.getItem("isEmployee") || localStorage.getItem("is_employee") || "false");

  const [q, setQ] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const fetchList = async () => {
    try {
      setLoading(true);
      setErr("");
      const data = await listProducts(q);
      setRows(data);
    } catch (e) {
      setErr(e.response?.data ? JSON.stringify(e.response.data) : e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchList(); /* eslint-disable-line */ }, []);

  return (
    <>
      <Navbar token={token} isEmployee={isEmployee} />
      <div className="pm">
        <div className="pm-container">
          <div className="pm-toolbar">
            <input
              className="pm-input"
              placeholder="Szukaj po nazwie/opisie/kraju…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchList()}
            />
            <button className="pm-btn" onClick={fetchList}>Szukaj</button>
            <Link className="pm-btn primary" to="/panel/add">Dodaj produkt</Link>
          </div>

          {err && <div className="pm-muted" style={{ marginTop: 12 }}>Błąd: {err}</div>}

          <ProductTable rows={rows} onUpdated={fetchList} loading={loading} />
        </div>
      </div>
    </>
  );
}

