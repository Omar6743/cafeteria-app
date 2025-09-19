import React, { useMemo, useState, useEffect, useCallback } from "react";
import "../styles/cashregister.css";

// ================= Config =================
const API_BASE = "http://localhost:8080/api";

// Claves por día (para no pedir fondo inicial otra vez)
const todayKey = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
const LS_HAS_OPENED = `cash.hasOpened:${todayKey}`;
const LS_OPEN_FLOAT = `cash.openingFloat:${todayKey}`;

const fmt = (n) =>
  Number(n || 0).toLocaleString("es-MX", { style: "currency", currency: "MXN" });

export default function CashRegister() {
  // ---------- Estado de caja ----------
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(localStorage.getItem(LS_HAS_OPENED) === "1");
  const [openedAt, setOpenedAt] = useState(null);
  const [openingFloat, setOpeningFloat] = useState(
    Number(localStorage.getItem(LS_OPEN_FLOAT) || 0)
  );
  const [sessionId, setSessionId] = useState(null);

  // ---------- Resumen (local) ----------
  const [movements, setMovements] = useState([]); // solo para tarjetas de resumen locales

  const cashSales = useMemo(
    () => movements.filter(m => m.type === "sale" && m.method === "cash")
                  .reduce((a, b) => a + b.amount, 0),
    [movements]
  );
  const cardSales = useMemo(
    () => movements.filter(m => m.type === "sale" && m.method === "card")
                  .reduce((a, b) => a + b.amount, 0),
    [movements]
  );
  const expenses = useMemo(
    () => movements.filter(m => m.type === "expense").reduce((a, b) => a + b.amount, 0),
    [movements]
  );
  const deposits = useMemo(
    () => movements.filter(m => m.type === "deposit").reduce((a, b) => a + b.amount, 0),
    [movements]
  );
  const withdrawals = useMemo(
    () => movements.filter(m => m.type === "withdrawal").reduce((a, b) => a + b.amount, 0),
    [movements]
  );
  const adjustments = useMemo(
    () => movements.filter(m => m.type === "adjustment").reduce((a, b) => a + b.amount, 0),
    [movements]
  );

  const expectedCash = useMemo(
    () => Number(openingFloat) + cashSales - expenses - deposits - withdrawals + adjustments,
    [openingFloat, cashSales, expenses, deposits, withdrawals, adjustments]
  );

  // ---------- Catálogo ----------
  const [categories, setCategories] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [catFilter, setCatFilter] = useState(null);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCats = async () => {
      try {
        const res = await fetch(`${API_BASE}/categories`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setCategories(await res.json());
      } catch {
        setCategories([]);
      }
    };
    loadCats();
  }, []);

  const loadProducts = useCallback(async (opts = {}) => {
    const { page = 0, size = 200, cat = catFilter, query = q } = opts;
    const params = new URLSearchParams();
    params.set("page", page); params.set("size", size);
    if (cat) params.set("cat", cat);
    if (query && query.trim()) params.set("q", query.trim());

    setLoading(true); setError(null);
    try {
      const res = await fetch(`${API_BASE}/products?` + params.toString());
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const pageData = await res.json();
      const items = (pageData.content || []).map(p => ({
        id: String(p.id),
        name: p.name,
        price: Number(p.basePrice),
        categoryId: p.categoryId,
        categoryName: p.categoryName,
        active: p.active,
      }));
      setCatalog(items.filter(x => x.active !== false));
    } catch (e) {
      console.error(e);
      setError("No se pudieron cargar productos");
      setCatalog([]);
    } finally {
      setLoading(false);
    }
  }, [catFilter, q]);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  // ---------- Carrito ----------
  const [cart, setCart] = useState([]);
  const [note, setNote] = useState("");
  const [discount, setDiscount] = useState(0);
  const subtotal = useMemo(() => cart.reduce((s, i) => s + i.price * i.qty, 0), [cart]);
  const total = useMemo(() => Math.max(0, subtotal - Number(discount || 0)), [subtotal, discount]);

  // Cobro
  const [payMethod, setPayMethod] = useState("cash");
  const [cashGiven, setCashGiven] = useState(0);
  const change = useMemo(() => payMethod === "cash"
    ? Math.max(0, Number(cashGiven || 0) - total) : 0, [cashGiven, payMethod, total]);

  // ---------- Helpers carrito ----------
  const addToCart = (p) => {
    setCart(prev => {
      const idx = prev.findIndex(x => x.id === p.id);
      if (idx >= 0) {
        const next = [...prev]; next[idx] = { ...next[idx], qty: next[idx].qty + 1 }; return next;
      }
      return [...prev, { id: p.id, name: p.name, price: p.price, qty: 1 }];
    });
  };
  const changeQty = (id, qty) => {
    setCart(prev => prev.map(x => x.id === id ? { ...x, qty: Math.max(0, Number(qty) || 0) } : x)
                       .filter(x => x.qty > 0));
  };
  const removeItem = (id) => setCart(prev => prev.filter(x => x.id !== id));
  const clearCart = () => { setCart([]); setNote(""); setDiscount(0); setCashGiven(0); };

  // ---------- Apertura / cierre ----------
  const openRegister = async (e, reuse = false) => {
    e?.preventDefault?.();
    const floatToUse = reuse
      ? Number(localStorage.getItem(LS_OPEN_FLOAT) || openingFloat || 0)
      : Number(openingFloat || 0);

    try {
      const res = await fetch(`${API_BASE}/cash-sessions/open`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ openingFloat: floatToUse }),
      });
      if (!res.ok) throw new Error("No se pudo abrir la caja");
      const data = await res.json(); // {id, openedAt, openingFloat,...}

      setIsOpen(true);
      setOpenedAt(data.openedAt || new Date().toISOString());
      setSessionId(data.id);
      setHasOpened(true);

      localStorage.setItem(LS_HAS_OPENED, "1");
      localStorage.setItem(LS_OPEN_FLOAT, String(floatToUse));
      setOpeningFloat(floatToUse);
    } catch (err) {
      alert(err.message);
    }
  };

  const closeRegister = async () => {
    if (!isOpen || !sessionId) { setIsOpen(false); return; }
    try {
      const res = await fetch(`${API_BASE}/cash-sessions/${sessionId}/close`, { method: "POST" });
      if (!res.ok) throw new Error("No se pudo cerrar la caja");
    } catch {
      // si falla, igual cerramos UI
    } finally {
      setIsOpen(false);
      setSessionId(null);
      // no borramos hasOpened ni openingFloat del día
    }
  };

  const addMovementLocal = (payload) => {
    setMovements(prev => [...prev, { ...payload }]);
  };

  const [lastTicket, setLastTicket] = useState(null);

  const charge = async () => {
    if (!isOpen || total <= 0 || cart.length === 0) return;
    if (payMethod === "cash" && Number(cashGiven) < total) return;

    const payload = {
      sessionId,
      items: cart.map(i => ({
        productId: Number(i.id),
        qty: i.qty,
        price: i.price
      })),
      discount: Number(discount || 0),
      payMethod,
      cashGiven: payMethod === "cash" ? Number(cashGiven || 0) : 0,
      note
    };

    try {
      const res = await fetch(`${API_BASE}/sales`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`No se pudo registrar la venta (HTTP ${res.status})\n${txt}`);
      }
      const data = await res.json(); // {orderId,total,change}

      // Actualiza resumen local
      addMovementLocal({
        type: "sale",
        method: payMethod,
        amount: total,
        note
      });

      // Guardar ticket
      setLastTicket({
        items: cart,
        subtotal,
        discount: Number(discount || 0),
        total,
        payMethod,
        cashGiven: Number(cashGiven || 0),
        change: data.change ?? 0,
        createdAt: new Date().toLocaleString(),
        note,
      });

      clearCart();
    } catch (err) {
      alert(err.message);
    }
  };

  const printTicket = () => window.print();

  // ================= Render =================
  return (
    <main className="cr">
      <header className="cr-head">
        <h1>Control de caja</h1>
        <div className="actions">
          <button className="btn" onClick={()=>{
            const header = "createdAt,type,method,amount,note";
            const rows = movements.map(m => [
              new Date().toISOString(), m.type, m.method||"", m.amount, (m.note||"").replaceAll(",", " ")
            ].join(","));
            const a = document.createElement("a");
            a.href = URL.createObjectURL(new Blob([header+"\n"+rows.join("\n")],{type:"text/csv;charset=utf-8"}));
            a.download = `movimientos_${new Date().toISOString().slice(0,16).replace(/[:T]/g,"-")}.csv`;
            a.click(); URL.revokeObjectURL(a.href);
          }}>CSV</button>

          <button className="btn" onClick={()=>{
            const meta = { openedAt, openingFloat, expectedCash };
            const data = { meta, movements };
            const a = document.createElement("a");
            a.href = URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:"application/json"}));
            a.download = `caja_${new Date().toISOString().slice(0,16).replace(/[:T]/g,"-")}.json`;
            a.click(); URL.revokeObjectURL(a.href);
          }}>JSON</button>

          {lastTicket && <button className="btn" onClick={printTicket}>Imprimir ticket</button>}
        </div>
      </header>

      <section className="cards">
        <Card label="Estado" value={isOpen ? "Abierta" : "Cerrada"} />
        <Card label="Fondo inicial" value={fmt(openingFloat)} />
        <Card label="Ventas (efectivo)" value={fmt(cashSales)} />
        <Card label="Ventas (tarjeta)" value={fmt(cardSales)} />
        <Card label="Gastos" value={fmt(expenses)} />
        <Card label="Depósitos" value={fmt(deposits)} />
        <Card label="Retiros" value={fmt(withdrawals)} />
        <Card label="Ajustes" value={fmt(adjustments)} />
        <Card label="Esperado en caja" value={fmt(expectedCash)} highlight />
      </section>

      <div className="cols">
        <section className="panel">
          <h2>Apertura / Cierre</h2>

          {!isOpen && !hasOpened && (
            <form className="form" onSubmit={(e) => openRegister(e, false)}>
              <label>Fondo inicial (efectivo)</label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={openingFloat}
                onChange={(e) => setOpeningFloat(e.target.value)}
              />
              <button className="btn primary" type="submit">Abrir caja</button>
            </form>
          )}

          {!isOpen && hasOpened && (
            <div className="form">
              <p className="muted">El saldo inicial del día es <b>{fmt(openingFloat)}</b></p>
              <button className="btn primary" onClick={() => openRegister(null, true)}>
                Abrir caja
              </button>
            </div>
          )}

          {isOpen && (
            <>
              <p className="muted">Abierta: {openedAt ? new Date(openedAt).toLocaleString() : ""}</p>
              <button className="btn danger" onClick={closeRegister}>Cerrar caja</button>
            </>
          )}

          <hr className="sep" />
          <QuickOps onAdd={(m) => addMovementLocal(m)} disabled={!isOpen} />
        </section>

        <section className="panel">
          <h2>Venta rápida (POS)</h2>

          <div className="filters">
            <input
              placeholder="Buscar producto..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && loadProducts({ page: 0 })}
            />
            <select
              value={catFilter ?? ""}
              onChange={(e) =>
                setCatFilter(e.target.value ? Number(e.target.value) : null)
              }
            >
              <option value="">Todas las categorías</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <button className="btn" onClick={() => loadProducts({ page: 0 })}>Buscar</button>
          </div>

          <div className="pos">
            <div className="catalog">
              {loading ? <div className="muted">Cargando productos...</div>
                : error ? <div className="muted">{error}</div>
                : catalog.length === 0 ? <div className="muted">Sin resultados</div>
                : catalog.map((p) => (
                    <button key={p.id} className="chip" onClick={() => addToCart(p)} title={p.categoryName || ""}>
                      <span>{p.name}</span><b>{fmt(p.price)}</b>
                    </button>
                  ))
              }
            </div>

            <div className="cart">
              <table className="tbl small">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th className="num">P.U.</th>
                    <th className="num">Cant.</th>
                    <th className="num">Importe</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {cart.length === 0 ? (
                    <tr><td colSpan="5" className="empty">Sin productos</td></tr>
                  ) : cart.map((i) => (
                      <tr key={i.id}>
                        <td>{i.name}</td>
                        <td className="num">{fmt(i.price)}</td>
                        <td className="num">
                          <input className="qty" type="number" min="1" step="1"
                            value={i.qty} onChange={(e) => changeQty(i.id, e.target.value)} />
                        </td>
                        <td className="num">{fmt(i.price * i.qty)}</td>
                        <td><button className="icon" onClick={() => removeItem(i.id)}>✕</button></td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>

              <div className="cart-extra">
                <div className="row">
                  <label>Descuento (MXN)</label>
                  <input type="number" step="0.5" min="0" value={discount}
                    onChange={(e) => setDiscount(e.target.value)} />
                </div>
                <div className="row">
                  <label>Nota</label>
                  <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Mesa 3, cliente, etc." />
                </div>
              </div>

              <div className="totals">
                <div><span>Subtotal</span><b>{fmt(subtotal)}</b></div>
                <div><span>Descuento</span><b>{fmt(discount)}</b></div>
                <div className="total"><span>Total</span><b>{fmt(total)}</b></div>
              </div>

              <div className="pay">
                <select value={payMethod} onChange={(e) => setPayMethod(e.target.value)}>
                  <option value="cash">Efectivo</option>
                  <option value="card">Tarjeta</option>
                </select>

                {payMethod === "cash" && (
                  <>
                    <input type="number" step="0.5" min="0" placeholder="Efectivo recibido"
                      value={cashGiven} onChange={(e) => setCashGiven(e.target.value)} />
                    <div className="change">Cambio: <b>{fmt(change)}</b></div>
                  </>
                )}

                <button
                  className="btn primary"
                  disabled={!isOpen || !sessionId || cart.length === 0 || total <= 0 ||
                    (payMethod === "cash" && Number(cashGiven) < total)}
                  onClick={charge}
                >
                  Cobrar
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Ticket imprimible */}
      <div className="receipt-print">
        {lastTicket && (
          <TicketPrint
            ticket={lastTicket}
            shop={{ name: "Cafetería Orgánica", rfc: "DEMO000000", addr: "Pueblo, MX" }}
          />
        )}
      </div>
    </main>
  );
}

/* ---------- Subcomponentes ---------- */
function Card({ label, value, highlight, tone }) {
  return (
    <div className={`card ${highlight ? "hl" : ""} ${tone || ""}`}>
      <span className="lab">{label}</span>
      <strong className="val">{value}</strong>
    </div>
  );
}

function QuickOps({ onAdd, disabled }) {
  const [kind, setKind] = useState("expense");
  const [amount, setAmount] = useState(0);
  const [note, setNote] = useState("");

  const submit = () => {
    const a = Number(amount);
    if (!a) return;
    onAdd({
      type: kind,
      method: null,
      amount: kind === "adjustment" ? a : Math.abs(a),
      note: note.trim(),
    });
    setAmount(0); setNote("");
  };

  return (
    <div className="quickops">
      <h3>Operaciones de caja</h3>
      <div className="row">
        <select value={kind} onChange={(e) => setKind(e.target.value)} disabled={disabled}>
          <option value="expense">Gasto</option>
          <option value="deposit">Depósito</option>
          <option value="withdrawal">Retiro</option>
          <option value="adjustment">Ajuste (+/-)</option>
        </select>
        <input type="number" step="0.5" min={kind === "adjustment" ? "-999999" : "0"}
          value={amount} onChange={(e) => setAmount(e.target.value)} disabled={disabled} />
      </div>
      <input placeholder="Nota / referencia" value={note}
        onChange={(e) => setNote(e.target.value)} disabled={disabled} />
      <button className="btn" onClick={submit} disabled={disabled || !Number(amount)}>Guardar</button>
    </div>
  );
}

function TicketPrint({ ticket, shop }) {
  const { items, subtotal, discount, total, payMethod, cashGiven, change, createdAt, note } = ticket;
  const fmt = (n) => Number(n || 0).toLocaleString("es-MX", { style: "currency", currency: "MXN" });

  return (
    <div className="ticket">
      <h1>{shop.name}</h1>
      <p>{shop.addr}</p>
      <p>RFC: {shop.rfc}</p>
      <p>{createdAt}</p>
      <hr />
      <table>
        <thead>
          <tr><th>Concepto</th><th>Cant</th><th className="num">P.U.</th><th className="num">Imp.</th></tr>
        </thead>
        <tbody>
          {items.map((i) => (
            <tr key={i.id}>
              <td>{i.name}</td>
              <td>{i.qty}</td>
              <td className="num">{fmt(i.price)}</td>
              <td className="num">{fmt(i.price * i.qty)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <hr />
      <div className="t-line"><span>Subtotal</span><b>{fmt(subtotal)}</b></div>
      <div className="t-line"><span>Descuento</span><b>{fmt(discount)}</b></div>
      <div className="t-line big"><span>Total</span><b>{fmt(total)}</b></div>
      <div className="t-line"><span>Método</span><b>{payMethod === "cash" ? "Efectivo" : "Tarjeta"}</b></div>
      {payMethod === "cash" && (
        <>
          <div className="t-line"><span>Recibido</span><b>{fmt(cashGiven)}</b></div>
          <div className="t-line"><span>Cambio</span><b>{fmt(change)}</b></div>
        </>
      )}
      {note && <div className="note">Nota: {note}</div>}
      <p className="thanks">¡Gracias por su compra!</p>
    </div>
  );
}
