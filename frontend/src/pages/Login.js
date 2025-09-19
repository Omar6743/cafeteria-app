import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // 👈 NUEVO
import "../styles/login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // 👈 NUEVO

  const validate = () => {
    const e = {};
    if (!email.trim()) e.email = "Ingresa tu correo";
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = "Correo inválido";
    if (!pass) e.pass = "Ingresa tu contraseña";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);

    // Simulación de login
    setTimeout(() => {
      setLoading(false);

      // (opcional) deja una “sesión” de prueba para tu amiga
      // sessionStorage.setItem("isAuthed", "1");

      // 🚀 Redirigir al dashboard
      navigate("/dashboard", { replace: true, state: { from: "login" } });
    }, 900);
  };

  return (
    <div className="auth-layout">
      {/* Panel ilustración (izquierda) */}
      <aside className="auth-hero" aria-hidden>
        <div className="auth-hero-inner">
          <h2>Bienvenido/a</h2>
          <p>Accede con credenciales seguras. Protegemos tus datos con cifrado y controles de acceso.</p>
        </div>
      </aside>

      {/* Columna derecha */}
      <main className="auth-card">
        {/* Taza pro: redonda + paleta sobria */}
        <div className="cup-login cup--round cup--quiet">
          <div className="cup-body">
            <div className="cup-rim" aria-hidden></div>
            <div className="cup-coffee" aria-hidden></div>
            <div className="cup-gloss" aria-hidden></div>

            {/* Contenido */}
            <div className="cup-inner">
              <h1 className="auth-title">Iniciar sesión</h1>
              <p className="auth-sub">Usa tu cuenta de la cafetería</p>

              <form onSubmit={submit} noValidate className="form">
                {/* Correo */}
                <div className="field">
                  <input
                    id="email"
                    type="email"
                    placeholder=" "
                    className={`control ${errors.email ? "is-error" : ""}`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="username"
                    aria-invalid={!!errors.email}
                  />
                  <label htmlFor="email">Correo</label>
                  {errors.email && <span className="msg">{errors.email}</span>}
                </div>

                {/* Contraseña */}
                <div className="field">
                  <input
                    id="pass"
                    type={show ? "text" : "password"}
                    placeholder=" "
                    className={`control ${errors.pass ? "is-error" : ""}`}
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    autoComplete="current-password"
                    aria-invalid={!!errors.pass}
                  />
                  <label htmlFor="pass">Contraseña</label>
                  <button
                    type="button"
                    className="reveal"
                    onClick={() => setShow((s) => !s)}
                    aria-controls="pass"
                    aria-pressed={show}
                  >
                    {show ? "Ocultar" : "Mostrar"}
                  </button>
                  {errors.pass && <span className="msg">{errors.pass}</span>}
                </div>

                <div className="meta">
                  <label className="check">
                    <input type="checkbox" /> Recuérdame
                  </label>
                  <a className="muted" href="#">¿Olvidaste tu contraseña?</a>
                </div>

                <button className="btn btn-primary" disabled={loading} type="submit">
                  {loading ? "Iniciando..." : "Entrar"}
                </button>

                <p className="legal">
                  Al continuar aceptas nuestras políticas de privacidad y uso responsable de datos.
                </p>
              </form>
            </div>
          </div>

          {/* elementos externos */}
          <div className="cup-handle" aria-hidden></div>
          <div className="cup-steam" aria-hidden>
            <span></span><span></span><span></span><span></span><span></span>
          </div>
        </div>
      </main>
    </div>
  );
}
