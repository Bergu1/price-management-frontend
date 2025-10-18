import React from "react";
import { useProductsPolling } from "../hooks/useProductsPolling";

export default function ProductsLive() {
  const { data: products, error } = useProductsPolling({
    intervalMs: 3000, // co 3 sekundy
    url: "/api/products/product_view/",
  });

  if (error) return <div style={{ color: "red" }}>Błąd: {String(error)}</div>;
  if (!products.length) return <div>Ładowanie...</div>;

  return (
    <div>
      <h2>Produkty (live)</h2>
      <ul>
        {products.map(p => (
          <li key={p.id}>
            <strong>{p.name}</strong> — d1:{p.d1_mm ?? "–"} mm, d2:{p.d2_mm ?? "–"} mm, w:{p.weight_g ?? "–"} g
          </li>
        ))}
      </ul>
    </div>
  );
}
