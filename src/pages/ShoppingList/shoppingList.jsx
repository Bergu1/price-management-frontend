/* ========================= ShoppingList.jsx ========================= */
// Wklej ten komponent do src/pages/ShoppingList.jsx i zaimportuj powyższy CSS plikowo.
import React, { useEffect, useMemo, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import AlertMessage from '../../components/AlertMessage/AlertMessage';
import './styles/shoppingList.css';

export default function ShoppingList(){
  const [items, setItems] = useState([]);           // [{ id, product: { name, picture, price1 }, quantity }]
  const [purchased, setPurchased] = useState([]);   // id-ki odhaczonych (klientowo)
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const isEmployee = localStorage.getItem('isEmployee') === 'true';

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const showMessage = (text, type='success') => { setMessage(text); setMessageType(type); };

  // Pobranie listy z backendu
  useEffect(()=>{
    (async()=>{
      try{
        const res = await fetch('http://localhost:8000/api/shopping/shopping-list/',{
          headers:{ 'Content-Type':'application/json', 'Authorization': 'Token '+token }
        });
        if(!res.ok) throw new Error('Failed to fetch shopping list');
        const data = await res.json();
        setItems(Array.isArray(data)? data : (data.items||[]));
      }catch(err){ console.error(err); showMessage('Nie udało się wczytać listy.', 'error'); }
      finally{ setLoading(false); }
    })();
  },[token]);

  // Akcje klientowe
  function togglePurchased(id){
    setPurchased(p=> p.includes(id) ? p.filter(x=>x!==id) : [...p,id]);
    showMessage('Zaktualizowano status produktu', 'success');
  }

  async function removeItem(id){
    try{
      const res = await fetch(`http://localhost:8000/api/shopping/shopping-list/${id}/`,{
        method:'DELETE', headers:{ 'Content-Type':'application/json','Authorization':'Token '+token }
      });
      if(!res.ok) throw new Error('Delete failed');
      setItems(prev=> prev.filter(x=>x.id!==id));
      showMessage('Usunięto z listy', 'success');
    }catch(e){ console.error(e); showMessage('Nie udało się usunąć produktu', 'error'); }
  }

  // Widoki pomocnicze
  const filteredOpen = useMemo(()=> items.filter(i=>!purchased.includes(i.id)),[items,purchased]);
  const total = useMemo(()=> filteredOpen.reduce((s,i)=> s + (parseFloat(i?.product?.price1||0)||0) * (i.quantity||1), 0),[filteredOpen]);

  if (loading) return (<div className="empty" style={{minHeight:'50vh'}}>Ładowanie listy…</div>);

  return (
    <div className="page">
      {message && (
        <div className="mb-4">
          <AlertMessage
            message={message}
            type={messageType}
            onClose={() => setMessage('')}
          />
        </div>
      )}
      <Navbar token={token} isEmployee={isEmployee} />

      <div className="shopping-header">
        🛒 <strong>Shopping List</strong>
      </div>


      <main className="main">
        {/* Lista pozycji */}
        <section className="card">
          {items.length===0 ? (
            <div className="empty">No items in your list.</div>
          ) : (
            <div>
              {items.map((item)=>{
                const isPurchased = purchased.includes(item.id);
                const price = parseFloat(item?.product?.price1||0)||0;
                const qty = item.quantity || 1;
                return (
                  <article key={item.id} className={`item ${isPurchased? 'purchased':''}`}>
                    <img src={item?.product?.picture || 'https://via.placeholder.com/72'} alt={item?.product?.name||''} />
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:'flex',justifyContent:'space-between',gap:10,alignItems:'baseline'}}>
                        <div className="item-title" title={item?.product?.name}>{item?.product?.name}</div>
                        <div style={{textAlign:'right'}}>
                          <div className="item-title">{(price*qty).toFixed(2)} PLN</div>
                          <div className="item-sub">{price.toFixed(2)} PLN / szt.</div>
                        </div>
                      </div>
                      <div className="item-actions">
                        <div className="qty">
                          {/* Zakładam, że ilość zmieniasz tylko po stronie klienta – jeśli chcesz PATCH do API, dopiszę */}
                          <button onClick={()=> setItems(prev=> prev.map(x=> x.id===item.id?{...x, quantity: Math.max(1,(x.quantity||1)-1)}:x))}>-</button>
                          <span>{qty}</span>
                          <button onClick={()=> setItems(prev=> prev.map(x=> x.id===item.id?{...x, quantity: (x.quantity||1)+1}:x))}>+</button>
                        </div>
                        <button className="btnSL ghost" onClick={()=>togglePurchased(item.id)}>{isPurchased? 'Odznacz':'Odhacz jako kupione'}</button>
                        <button className="btnSL danger" onClick={()=>removeItem(item.id)}>Usuń</button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* Podsumowanie */}
        <aside className="card pad">
          <h3 style={{margin:'6px 0 10px',fontWeight:700}}>Podsumowanie</h3>
          <div className="summary-row"><span>Razem do kupienia</span><span className="total">{total.toFixed(2)} PLN</span></div>
          <div className="tools">
            <button className="btnSL" onClick={()=>setItems([])}>Wyczyść listę</button>
            <button className="btnSL primary" onClick={()=>{navigator.clipboard.writeText(window.location.href); showMessage('Skopiowano link do schowka','success')}}>Udostępnij link</button>
          </div>
          <p className="item-sub" style={{marginTop:10}}>Możesz tu spokojnie sporządzić całą swoją listę zakupów — dodawaj produkty, aktualizuj ilości i odhaczaj to, co już masz. Lista jest przejrzysta i zawsze pod ręką, dlatego niczego nie zapomnisz, nawet jeśli wrócisz do niej po kilku dniach.</p>
        </aside>
      </main>
    </div>
  );
}