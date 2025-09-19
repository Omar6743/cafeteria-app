import React from "react";
import { Link } from "react-router-dom";
import "../styles/dashboard.css";

export default function Dashboard() {
  return (
    <main className="dashboard">
      <div className="container">
        <header className="dash-header">
          <div>
            <p className="dash-eyebrow">Panel de gestión</p>
            <h1 className="dash-title">Bienvenida a tu centro de control</h1>
            <p className="dash-sub">
              Accede a caja, trazabilidad, seguridad de datos y fidelización.
            </p>
          </div>
        </header>

        <section className="dash-grid">
          <DashCard
            to="/caja"
            title="Control de caja"
            desc="Arqueos, ventas y movimientos"
            icon={<CashIcon />}
          />
          <DashCard
            to="/trazabilidad"
            title="Trazabilidad orgánica"
            desc="Lotes, origen y certificación"
            icon={<TraceIcon />}
          />
          <DashCard
            to="/seguridad"
            title="Seguridad de datos"
            desc="Usuarios, roles y privacidad"
            icon={<ShieldIcon />}
          />
          <DashCard
            to="/fidelizacion"
            title="Fidelización"
            desc="Clientes, puntos y beneficios"
            icon={<GiftIcon />}
          />
        </section>
      </div>
    </main>
  );
}

/* -------- Tarjeta -------- */
function DashCard({ to, title, desc, icon }) {
  return (
    <Link to={to} className="dash-card">
      <div className="dash-icon">{icon}</div>
      <div className="dash-card-body">
        <h3>{title}</h3>
        <p>{desc}</p>
      </div>
      <div className="dash-card-cta" aria-hidden>→</div>
    </Link>
  );
}

/* -------- Iconos SVG (limpios) -------- */
function CashIcon(){
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden>
      <path fill="currentColor" d="M3 7h18a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Zm0 2v6h18V9H3Zm3 4a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm9 1h4v-2h-4v2Z"/>
    </svg>
  );
}
function TraceIcon(){
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden>
      <path fill="currentColor" d="M12 3a9 9 0 0 0-9 9c0 4.2 3 7.6 7 8.6.4.1.8-.2.9-.6l.3-2.5c.1-.4-.2-.8-.6-.9a6 6 0 1 1 4.1 0c-.4.1-.7.5-.6.9l.3 2.5c.1.4.5.7.9.6 4-1 7-4.4 7-8.6a9 9 0 0 0-9-9Z"/>
      <path fill="currentColor" d="M10.5 13.5 8 11l1.4-1.4 1.1 1.1 3.2-3.2L15 8l-4.5 5.5Z"/>
    </svg>
  );
}
function ShieldIcon(){
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden>
      <path fill="currentColor" d="M12 2 4 5v6c0 5 3.4 9.7 8 11 4.6-1.3 8-6 8-11V5l-8-3Zm0 2.2 6 2.3v4.5c0 4-2.5 7.8-6 9-3.5-1.2-6-5-6-9V6.5l6-2.3Z"/>
      <path fill="currentColor" d="M11 12.6 8.9 10.5 7.5 12l3.5 3.5L16.5 10l-1.4-1.4L11 12.6Z"/>
    </svg>
  );
}
function GiftIcon(){
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden>
      <path fill="currentColor" d="M20 7h-2.2c.1-.3.2-.7.2-1A3 3 0 1 0 12 7a3 3 0 1 0-6 0c0 .3.1.7.2 1H4a2 2 0 0 0-2 2v3h20V9a2 2 0 0 0-2-2ZM9 5a1 1 0 1 1 0 2H7a1 1 0 1 1 0-2h2Zm8 0a1 1 0 1 1-2 2h2a1 1 0 1 1 0-2ZM2 14v5a2 2 0 0 0 2 2h7v-7H2Zm11 7h7a2 2 0 0 0 2-2v-5h-9v7Z"/>
    </svg>
  );
}
