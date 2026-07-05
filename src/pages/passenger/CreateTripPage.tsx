import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createTrip, getAvailableDrivers } from "../../api/trips.api";
import { EmptyState } from "../../components/EmptyState";
import { ErrorMessage } from "../../components/ErrorMessage";
import { InlineLoader } from "../../components/InlineLoader";
import type { User } from "../../types/user.types";
import { formatRating, formatUserName } from "../../utils/format";

const samplePickups = [
  "Av. Javier Prado 1200, San Isidro",
  "UTEC, Barranco",
  "Plaza San Miguel, Lima",
];

const sampleDropoffs = [
  "Miraflores, Lima",
  "Real Plaza Salaverry, Jesús María",
  "Aeropuerto Jorge Chávez, Callao",
];

export function CreateTripPage() {
  const navigate = useNavigate();
  const [pickupAddress, setPickupAddress] = useState("");
  const [dropoffAddress, setDropoffAddress] = useState("");
  const [drivers, setDrivers] = useState<User[]>([]);
  const [selectedDriverId, setSelectedDriverId] = useState<number | null>(null);
  const [isLoadingDrivers, setIsLoadingDrivers] = useState(true);
  const [driversError, setDriversError] = useState("");
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadDrivers() {
      try {
        setIsLoadingDrivers(true);
        setDriversError("");
        const data = await getAvailableDrivers();
        if (!isMounted) return;
        setDrivers(data);
        setSelectedDriverId(data[0]?.id ?? null);
      } catch (err) {
        if (!isMounted) return;
        setDriversError(err instanceof Error ? err.message : "No se pudieron cargar los conductores.");
      } finally {
        if (isMounted) setIsLoadingDrivers(false);
      }
    }

    void loadDrivers();

    return () => {
      isMounted = false;
    };
  }, []);

  const selectedDriver = useMemo(
    () => drivers.find((driver) => driver.id === selectedDriverId) ?? null,
    [drivers, selectedDriverId],
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");

    if (!pickupAddress.trim() || !dropoffAddress.trim()) {
      setFormError("Completa el origen y destino del viaje.");
      return;
    }

    if (pickupAddress.trim().toLowerCase() === dropoffAddress.trim().toLowerCase()) {
      setFormError("El origen y el destino deben ser diferentes.");
      return;
    }

    try {
      setIsSubmitting(true);
      const trip = await createTrip({
        pickupAddress: pickupAddress.trim(),
        dropoffAddress: dropoffAddress.trim(),
      });
      navigate(`/passenger/trips/${trip.id}`, { replace: true });
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "No se pudo crear el viaje.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="dashboard-page create-trip-page">
      <section className="dashboard-hero create-trip-hero">
        <div>
          <p className="eyebrow dark-text">Nuevo viaje</p>
          <h1>Solicitar viaje</h1>
          <p>Elige tu origen, destino y revisa qué conductores están disponibles antes de confirmar.</p>
        </div>
        <Link to="/passenger/dashboard" className="secondary-button">
          Volver al dashboard
        </Link>
      </section>

      <section className="create-trip-grid">
        <form className="trip-form-card" onSubmit={handleSubmit}>
          <div className="section-heading compact-heading">
            <div>
              <p className="eyebrow dark-text">Ruta</p>
              <h2>¿A dónde vamos?</h2>
            </div>
          </div>

          <label>
            Origen
            <input
              value={pickupAddress}
              onChange={(event) => setPickupAddress(event.target.value)}
              placeholder="Ej. UTEC, Barranco"
              list="pickup-suggestions"
              autoComplete="street-address"
            />
          </label>

          <datalist id="pickup-suggestions">
            {samplePickups.map((value) => (
              <option key={value} value={value} />
            ))}
          </datalist>

          <label>
            Destino
            <input
              value={dropoffAddress}
              onChange={(event) => setDropoffAddress(event.target.value)}
              placeholder="Ej. Miraflores, Lima"
              list="dropoff-suggestions"
              autoComplete="street-address"
            />
          </label>

          <datalist id="dropoff-suggestions">
            {sampleDropoffs.map((value) => (
              <option key={value} value={value} />
            ))}
          </datalist>

          {selectedDriver ? (
            <div className="selected-driver-note">
              <span>Conductor disponible destacado</span>
              <strong>{formatUserName(selectedDriver.firstName, selectedDriver.lastName)}</strong>
              <small>El backend asignará el conductor cuando uno acepte la solicitud.</small>
            </div>
          ) : null}

          <ErrorMessage message={formError} />

          <button type="submit" className="primary-button" disabled={isSubmitting}>
            {isSubmitting ? "Creando viaje..." : "Confirmar viaje"}
          </button>
        </form>

        <aside className="drivers-panel">
          <div className="section-heading compact-heading">
            <div>
              <p className="eyebrow dark-text">Conductores</p>
              <h2>Disponibles ahora</h2>
            </div>
          </div>

          {isLoadingDrivers ? <InlineLoader message="Buscando conductores disponibles..." /> : null}

          {!isLoadingDrivers && driversError ? (
            <div className="dashboard-error" role="alert">
              {driversError}
            </div>
          ) : null}

          {!isLoadingDrivers && !driversError && drivers.length === 0 ? (
            <EmptyState
              title="No hay conductores disponibles"
              message="Puedes volver al dashboard e intentarlo nuevamente en unos minutos."
            />
          ) : null}

          {!isLoadingDrivers && !driversError && drivers.length > 0 ? (
            <div className="drivers-list">
              {drivers.map((driver) => (
                <button
                  key={driver.id}
                  type="button"
                  className={driver.id === selectedDriverId ? "driver-card selected" : "driver-card"}
                  onClick={() => setSelectedDriverId(driver.id)}
                >
                  <span className="driver-avatar">{driver.firstName.charAt(0)}{driver.lastName.charAt(0)}</span>
                  <span>
                    <strong>{formatUserName(driver.firstName, driver.lastName)}</strong>
                    <small>Rating {formatRating(driver.rating)} · Disponible</small>
                  </span>
                </button>
              ))}
            </div>
          ) : null}
        </aside>
      </section>
    </main>
  );
}
