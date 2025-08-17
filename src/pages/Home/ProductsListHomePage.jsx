import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/home.css";
import "./styles/productsListHomePage.css";

export default function HomePage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");

  // pobieramy z tego samego endpointu co ProductsList
  useEffect(() => {
    let alive = true;
    fetch("http://localhost:8000/api/products/product_view/")
      .then((r) => r.json())
      .then((data) => { if (alive) { setProducts(data || []); setLoading(false); }})
      .catch((e) => { if (alive) { setError("Nie udało się pobrać produktów."); setLoading(false); console.error(e);} });
    return () => { alive = false; };
  }, []);

  // polecane – losowe 6 sztuk, stabilne na render
  const featured = useMemo(() => {
    if (!products?.length) return [];
    const shuffled = [...products].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 6);
  }, [products]);

  // odliczanie do północy
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const midnight = useMemo(() => {
    const d = new Date();
    d.setHours(24,0,0,0);
    return d.getTime();
  }, []);
  const msLeft = Math.max(0, midnight - now);
  const hh = String(Math.floor(msLeft / 3_600_000)).padStart(2,"0");
  const mm = String(Math.floor((msLeft % 3_600_000) / 60_000)).padStart(2,"0");
  const ss = String(Math.floor((msLeft % 60_000) / 1000)).padStart(2,"0");

  return (
    <div className="home">
      {/* HERO */}
      <section className="hero">
        <div className="hero__inner">
          <div className="hero__copy">
            <div className="badge">Nowość 2025</div>
            <h1>Witamy w Twoim sklepie</h1>
            <p>Aktualne ceny, szybkie promocje i przejrzyste oferty — wszystko od razu po wejściu.</p>
            <div className="hero__cta">
              <a className="btn btn--primary" href="#offers">Zobacz promocje</a>
              <a className="btn btn--ghost" href="#featured">Polecane produkty</a>
            </div>
          </div>

          {/* Karta z odliczaniem (bez “START10”, ptaszki z CSS) */}
          <div className="hero__card">
            <div className="hero__card-top">
              <span>Oferty dnia kończą się za</span>
              <strong className="countdown">{hh}:{mm}:{ss}</strong>
            </div>
            <ul className="hero__perks">
              <li>Darmowa dostawa od 100 zł</li>
              <li>Świeże produkty</li>
              <li>Niższe ceny codziennie</li>
            </ul>
          </div>
        </div>
      </section>

      {/* PROMOCJE / OFERTY */}
      <section id="offers" className="promos">
        <article className="promo promo--blue">
          <div>
            <h3>Back to School -20%</h3>
            <p>Na wybrane kategorie do 31.08.</p>
          </div>
          <a className="link" href="#featured">Sprawdź</a>
        </article>
        <article className="promo promo--green">
          <div>
            <h3>2 + 1 Gratis</h3>
            <p>Najtańszy produkt za 0 zł w koszyku</p>
          </div>
          <a className="link" href="#featured">Poluj</a>
        </article>
        <article className="promo promo--yellow">
          <div>
            <h3>Darmowa dostawa</h3>
            <p>Przy zamówieniu powyżej 199 zł — tylko dziś</p>
          </div>
          <a className="link" href="#featured">Kup teraz</a>
        </article>
      </section>

      {/* SZYBKIE KATEGORIE */}
      <section className="quickcats">
        <a className="qcat" href="#featured">Nowości</a>
        <a className="qcat" href="#featured">Bestsellery</a>
        <a className="qcat" href="#featured">Promocje</a>
        <a className="qcat" href="#featured">Outlet</a>
      </section>

      {/* OFERTY DNIA – wyraźna promocja: stara/nowa cena + % */}
      <section className="deals">
        <div className="section-head">
          <h2>Oferty dnia</h2>
          <span className="section-sub">Kończą się o północy</span>
        </div>

        <div className="product-list product-list--tight">
          {(loading || error) ? (
            <p>{error || "Ładowanie..."}</p>
          ) : (
            products.slice(0, 3).map(p => {
              const priceNow = Number(p.price1 || 0);
              // jeśli masz w API starą cenę, użyj p.old_price; w przeciwnym razie policz „pseudo-starą”
              const old = p.old_price ? Number(p.old_price) : (priceNow > 0 ? priceNow * 1.15 : 0);
              const discount = old > 0 && priceNow > 0
                ? Math.round((1 - priceNow / old) * 100)
                : 0;

              return (
                <div className="product-card" key={p.id}>
                  <span className="badge badge--deal">Promocja</span>

                  {p.picture && (
                    <img className="product-image" src={p.picture} alt={p.name} />
                  )}

                  <div className="product-info">
                    <h3>{p.name}</h3>
                    <p><strong>Country:</strong> {p.country_of_origin}</p>

                    <div className="price-row">
                      {old > 0 && (
                        <span className="price-old">
                          {old.toFixed(2)} zł
                        </span>
                      )}
                      <span className="price-new">
                        {priceNow.toFixed(2)} zł
                      </span>
                      {discount > 0 && (
                        <span className="price-off">-{discount}%</span>
                      )}
                    </div>

                    <button
                      className="btn btn--small btn--primary"
                      onClick={() => navigate("/shopPage")}
                    >
                      Przejdź do sklepu
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* POLECANE */}
      <section id="featured" className="featured">
        <div className="section-head">
          <h2>Polecane dla Ciebie</h2>
          <span className="section-sub">Na dobry start</span>
        </div>
        <div className="product-list">
          {(loading || error) ? (
            <p>{error || "Ładowanie..."}</p>
          ) : (
            featured.map(p => (
              <div className="product-card" key={p.id}>
                {p.picture && <img className="product-image" src={p.picture} alt={p.name} />}
                <div className="product-info">
                  <h3>{p.name}</h3>
                  <p><strong>Country:</strong> {p.country_of_origin}</p>
                  <p><strong>Price:</strong> {Number(p.price1 || 0).toFixed(2)} zł</p>
                  <div className="card-actions">
                    <button className="btn btn--small btn--ghost">Szczegóły</button>
                        <button
                          className="btn btn--small btn--primary"
                          onClick={() => navigate("/shopPage")}
                        >
                          Przejdź do sklepu
                        </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* STOPKA MINI */}
      <footer className="mini-footer">
        <div>© {new Date().getFullYear()} Strona sklepu DamKon - stworzona przez Konrada Landzberga do pracy inżynierskiej</div>
      </footer>
    </div>
  );
}
