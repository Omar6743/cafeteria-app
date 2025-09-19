import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";


const NAV_ITEMS = [
  {
    id: "home",
    label: "Inicio",
    href: "#",
    img:
      "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=600&q=70",
    title: "Panel principal",
    desc: "KPIs de caja, ventas y pedidos en tiempo real."
  },
  {
    id: "about",
    label: "Acerca de",
    href: "#about",
    img:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=70",
    title: "Nuestra misión",
    desc: "Café orgánico, comercio justo y trazabilidad."
  },
  {
    id: "menu",
    label: "Menu",
    href: "#menu",
    img:
      "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=600&q=70",
    title: "Catálogo",
    desc: "Bebidas, granos y productos de temporada."
  },
  {
    id: "events",
    label: "Eventos",
    href: "#events",
    img:
      "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=600&q=70",
    title: "Eventos",
    desc: "Catas, talleres y actividades de comunidad."
  },
  {
    id: "contact",
    label: "Contacto",
    href: "#contact",
    img:
      "https://images.unsplash.com/photo-1485217988980-11786ced9454?auto=format&fit=crop&w=600&q=70",
    title: "Contacto",
    desc: "Soporte y atención para proveedores y clientes."
  }
];

export default function Navbar() {
  const [open, setOpen] = useState(false);         // menú móvil
  const [preview, setPreview] = useState(null);    // item actual del preview
  const linksRef = useRef(null);

  // posiciona el preview debajo del link activo
  const setPreviewPos = (el) => {
    if (!linksRef.current || !el) return;
    const r = el.getBoundingClientRect();
    const p = linksRef.current.getBoundingClientRect();
    const centerX = r.left + r.width / 2 - p.left; // centro del link relativo al contenedor
    linksRef.current.style.setProperty("--pvX", `${centerX}px`);
  };

  const handleEnter = (e, item) => {
    setPreview(item);
    setPreviewPos(e.currentTarget);
  };

  const handleLeaveAll = () => setPreview(null);

  return (
    <header className="nav">
      <div className="container nav-inner">
        {/* Marca */}
        <div className="brand">
          <div className="brand-mark" aria-hidden>
            ☕
          </div>
          <span>Cafetería Orgánica</span>
        </div>

        {/* Toggle móvil */}
        <button
          className="nav-toggle"
          aria-label="Abrir menú"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          ☰
        </button>

        {/* Links */}
        <nav
          ref={linksRef}
          className={`nav-links ${open ? "open" : ""}`}
          role="navigation"
          aria-label="Principal"
          onMouseLeave={handleLeaveAll}
        >
          {/* Píldora deslizante opcional (queda bien con el preview) */}
          <span className="nav-hover" aria-hidden></span>

          {NAV_ITEMS.map((it) => (
            <a
              key={it.id}
              href={it.href}
              className="nav-link"
              onMouseEnter={(e) => handleEnter(e, it)}
            >
              {it.label}
            </a>
          ))}

          {/* CTA login, sin preview */}
          <Link className="nav-cta" to="/login">Login</Link>

          {/* PREVIEW dinámico */}
          {preview && (
            <div className="nav-preview show" role="status" aria-live="polite">
              <div className="nav-preview-card">
                <img src={preview.img} alt="" />
                <div>
                  <h4>{preview.title}</h4>
                  <p>{preview.desc}</p>
                </div>
              </div>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
