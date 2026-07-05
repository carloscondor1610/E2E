import { Link } from 'react-router-dom';

export function RegisterPage() {
  return (
    <main className="auth-page register-page">
      <section className="auth-hero" aria-label="Registro Uber E2E">
        <div className="auth-hero-content">
          <p className="eyebrow">Únete a Uber E2E</p>
          <h1>Empieza como pasajero o conductor</h1>
          <p>
            Crea una cuenta para probar el flujo completo: solicitar, aceptar, completar y calificar viajes.
          </p>
          <div className="hero-stats" aria-label="Roles disponibles">
            <span>Pasajero</span>
            <span>Conductor</span>
            <span>JWT + roles</span>
          </div>
        </div>
      </section>

      <section className="auth-panel" aria-label="Formulario de registro">
        <div className="auth-card uber-card">
          <div className="auth-card-header">
            <p className="eyebrow dark">Crea tu cuenta</p>
            <h2>Registro</h2>
            <p>En el Bloque 2 este formulario conectará con <strong>POST /auth/register</strong>.</p>
          </div>

          <form className="uber-form two-column-form">
            <div>
              <label htmlFor="firstName">Nombre</label>
              <input id="firstName" type="text" placeholder="Ana" disabled />
            </div>

            <div>
              <label htmlFor="lastName">Apellido</label>
              <input id="lastName" type="text" placeholder="Torres" disabled />
            </div>

            <div className="full-field">
              <label htmlFor="registerEmail">Correo electrónico</label>
              <input id="registerEmail" type="email" placeholder="ana@uber.com" disabled />
            </div>

            <div className="full-field">
              <label htmlFor="registerPassword">Contraseña</label>
              <input id="registerPassword" type="password" placeholder="Mínimo 6 caracteres" disabled />
            </div>

            <div className="full-field">
              <label htmlFor="role">Rol</label>
              <select id="role" disabled defaultValue="PASSENGER">
                <option value="PASSENGER">Pasajero</option>
                <option value="DRIVER">Conductor</option>
              </select>
            </div>

            <button className="primary-button full-field" type="button" disabled>
              Crear cuenta
            </button>
          </form>

          <p className="auth-switch">
            ¿Ya tienes cuenta? <Link to="/login">Iniciar sesión</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
