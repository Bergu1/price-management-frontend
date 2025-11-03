import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { listProducts } from "./api/products";
import ProductTable from "./components/ProductTable";
import "./styles/panel.css";

export default function Panel() {
  const token = localStorage.getItem("token");
  const isEmployee = JSON.parse(localStorage.getItem("isEmployee") || localStorage.getItem("is_employee") || "false");

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const fetchList = async () => {
    try {
      setLoading(true);
      setErr("");
      const data = await listProducts(); // bez q, usuwamy wyszukiwanie w tym komponencie
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
      <div className="pm pm-full">
        <div className="pm-container">
          {err && <div className="pm-muted" style={{ marginTop: 12 }}>Błąd: {err}</div>}
          <ProductTable rows={rows} onUpdated={fetchList} loading={loading} />
        </div>
      </div>
    </>
  );
}
