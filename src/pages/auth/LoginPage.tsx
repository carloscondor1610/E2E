import { FormEvent, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { ErrorMessage } from "../../components/ErrorMessage";
import { dashboardPathByRole } from "../../utils/routes";

interface LocationState {
  from?: {
    pathname?: string;
  };
}

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Ingresa tu correo y contraseña.");
      return;
    }

    try {
      setIsSubmitting(true);
      const user = await login({ email: email.trim(), password });
      const state = location.state as LocationState | null;
      const fallbackPath = dashboardPathByRole(user.role);
      navigate(state?.from?.pathname ?? fallbackPath, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo iniciar sesión.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page auth-page-login">
      <section className="auth-hero dark-hero">
        <div className="hero-content">
          <p className="eyebrow">Uber E2E</p>
          <h1>Muévete por la ciudad con solo unos clics</h1>
          <p className="hero-copy">Solicita viajes, revisa tu historial y continúa tu recorrido como pasajero o conductor.</p>
          <div className="hero-pills">
            <span>Viajes en tiempo real</span>
            <span>Conductores disponibles</span>
            <span>Calificación al finalizar</span>
          </div>
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-card">
          <p className="eyebrow dark-text">Bienvenido</p>
          <h2>Inicia sesión</h2>
          <p className="auth-subtitle">Entra a tu cuenta para continuar con tus viajes.</p>

          <form onSubmit={handleSubmit} className="auth-form">
            <label>
              Correo electrónico
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="ana@uber.com"
                autoComplete="email"
              />
            </label>

            <label>
              Contraseña
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="pass123"
                autoComplete="current-password"
              />
            </label>

            <ErrorMessage message={error} />

            <button type="submit" className="primary-button" disabled={isSubmitting}>
              {isSubmitting ? "Ingresando..." : "Continuar"}
            </button>
          </form>

          <div className="test-credentials">
            <p>Credenciales de prueba</p>
            <button type="button" onClick={() => { setEmail("ana@uber.com"); setPassword("pass123"); }}>
              Usar pasajero
            </button>
            <button type="button" onClick={() => { setEmail("carlos@uber.com"); setPassword("pass123"); }}>
              Usar conductor
            </button>
          </div>

          <p className="auth-footer">
            ¿Primera vez aquí? <Link to="/register">Crear cuenta</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
