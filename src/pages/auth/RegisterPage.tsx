import { Link } from 'react-router-dom';
import { StatusMessage } from '../../components/StatusMessage';

export function RegisterPage() {
  return (
    <main className="page-container narrow-container">
      <StatusMessage
        title="Bloque 1 listo: pantalla Registro reservada"
        description="En el Bloque 2 agregaremos el formulario real, selector PASSENGER/DRIVER y POST /auth/register."
      />

      <div className="card helper-card">
        <p>
          ¿Ya tienes cuenta? <Link to="/login">Ir a login</Link>
        </p>
      </div>
    </main>
  );
}
