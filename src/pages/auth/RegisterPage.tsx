import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { ErrorMessage } from "../../components/ErrorMessage";
import type { Role } from "../../types/user.types";
import { dashboardPathByRole } from "../../utils/routes";

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("PASSENGER");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim()) {
      setError("Completa todos los campos.");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    try {
      setIsSubmitting(true);
      const user = await register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
        role,
      });
      navigate(dashboardPathByRole(user.role), { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear la cuenta.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page auth-page-register">
      <section className="auth-hero light-hero">
        <div className="hero-content">
          <p className="eyebrow dark-text">Únete a Uber E2E</p>
          <h1>Empieza como pasajero o conductor</h1>
          <p className="hero-copy dark-copy">Crea tu cuenta y prueba el flujo completo de viajes de inicio a fin.</p>
          <div className="hero-pills muted-pills">
            <span>Pasajero</span>
            <span>Conductor</span>
            <span>Sesión segura</span>
          </div>
        </div>
      </section>

      <section className="auth-panel black-panel">
        <div className="auth-card dark-card">
          <p className="eyebrow">Crea tu cuenta</p>
          <h2>Registro</h2>
          <p className="auth-subtitle">Elige tu rol y completa tus datos para comenzar.</p>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-grid">
              <label>
                Nombre
                <input
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  placeholder="Ana"
                  autoComplete="given-name"
                />
              </label>

              <label>
                Apellido
                <input
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  placeholder="Torres"
                  autoComplete="family-name"
                />
              </label>
            </div>

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
                placeholder="Mínimo 6 caracteres"
                autoComplete="new-password"
              />
            </label>

            <label>
              Rol
              <select value={role} onChange={(event) => setRole(event.target.value as Role)}>
                <option value="PASSENGER">Pasajero</option>
                <option value="DRIVER">Conductor</option>
              </select>
            </label>

            <ErrorMessage message={error} />

            <button type="submit" className="primary-button inverted-button" disabled={isSubmitting}>
              {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
            </button>
          </form>

          <p className="auth-footer dark-footer">
            ¿Ya tienes cuenta? <Link to="/login">Iniciar sesión</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
