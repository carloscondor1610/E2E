import { Link } from 'react-router-dom';

export function LoginPage() {
  return (
    <main className="auth-page">
      <section className="auth-hero" aria-label="Presentación de Uber E2E">
        <div className="auth-hero-content">
          <p className="eyebrow">Uber E2E</p>
          <h1>Muévete por la ciudad con solo unos clics</h1>
          <p>
            Inicia sesión para solicitar viajes, revisar tu historial o continuar como conductor.
          </p>
          <div className="hero-stats" aria-label="Resumen de funciones">
            <span>Viajes en tiempo real</span>
            <span>Conductores disponibles</span>
            <span>Calificación al finalizar</span>
          </div>
        </div>
      </section>

      <section className="auth-panel" aria-label="Formulario de inicio de sesión">
        <div className="auth-card uber-card">
          <div className="auth-card-header">
            <p className="eyebrow dark">Bienvenido de nuevo</p>
            <h2>Inicia sesión</h2>
            <p>En el Bloque 2 este formulario conectará con <strong>POST /auth/login</strong>.</p>
          </div>

          <form className="uber-form">
            <label htmlFor="email">Correo electrónico</label>
            <input id="email" type="email" placeholder="ana@uber.com" disabled />

            <label htmlFor="password">Contraseña</label>
            <input id="password" type="password" placeholder="pass123" disabled />

            <button className="primary-button" type="button" disabled>
              Continuar
            </button>
          </form>

          <div className="demo-credentials">
            <p>Credenciales de prueba del backend:</p>
            <div>
              <span>Pasajero</span>
              <code>ana@uber.com / pass123</code>
            </div>
            <div>
              <span>Conductor</span>
              <code>carlos@uber.com / pass123</code>
            </div>
          </div>

          <p className="auth-switch">
            ¿Primera vez aquí? <Link to="/register">Crear una cuenta</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
