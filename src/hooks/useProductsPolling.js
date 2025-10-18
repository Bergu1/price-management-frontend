import { useEffect, useRef, useState } from "react";

export function useProductsPolling({ intervalMs = 2000, url = "/api/products/product_view/" } = {}) {
  const [data, setData]   = useState([]);
  const [error, setError] = useState(null);
  const timerRef = useRef(null);

  const clearTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const fetchData = async () => {
    try {
      const res = await fetch(url, { headers: { "Cache-Control": "no-cache" } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
      setError(null);
    } catch (e) {
      setError(e);
    } finally {
      timerRef.current = setTimeout(fetchData, intervalMs); // zaplanuj kolejne pobranie
    }
  };

  useEffect(() => {
    fetchData();                // start od razu
    return () => clearTimer();  // cleanup przy unmount
  }, [url, intervalMs]);

  return { data, error };
}
