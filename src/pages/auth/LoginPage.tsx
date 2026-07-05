import { Link } from 'react-router-dom';
import { StatusMessage } from '../../components/StatusMessage';

export function LoginPage() {
  return (
    <main className="page-container narrow-container">
      <StatusMessage
        title="Bloque 1 listo: pantalla Login reservada"
        description="En el Bloque 2 agregaremos el formulario real, POST /auth/login, guardado del JWT y redirección por rol."
      />

      <div className="card helper-card">
        <p>Credenciales de prueba del backend:</p>
        <code>ana@uber.com / pass123</code>
        <code>carlos@uber.com / pass123</code>
        <p>
          ¿No tienes usuario? <Link to="/register">Ir a registro</Link>
        </p>
      </div>
    </main>
  );
}
