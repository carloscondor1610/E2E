import { StatusMessage } from '../../components/StatusMessage';
import { useAuth } from '../../auth/AuthContext';

export function DriverDashboardPage() {
  const { user } = useAuth();

  return (
    <main className="page-container">
      <StatusMessage
        title={`Dashboard conductor preparado${user ? ` para ${user.firstName}` : ''}`}
        description="En los siguientes bloques agregaremos GET /trips/pending, GET /trips/my, aceptar y completar viajes."
      />
    </main>
  );
}
