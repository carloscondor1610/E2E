import { StatusMessage } from '../../components/StatusMessage';
import { useAuth } from '../../auth/AuthContext';

export function PassengerDashboardPage() {
  const { user } = useAuth();

  return (
    <main className="page-container">
      <StatusMessage
        title={`Dashboard pasajero preparado${user ? ` para ${user.firstName}` : ''}`}
        description="En los siguientes bloques agregaremos GET /trips, POST /trips, detalle y calificación."
      />
    </main>
  );
}
