# Uber E2E Frontend — Bloques 1 al 4

Avance acumulado del frontend para la rúbrica E2E.

## Incluye

- Bloque 1: base React + TypeScript + Vite, rutas y diseño tipo Uber.
- Bloque 2: login y registro funcionales.
- Bloque 3: JWT en localStorage, Authorization Bearer, sesión persistente y rutas por rol.
- Bloque 4: dashboard pasajero conectado a `GET /trips`.

## Inciso 2 cubierto

El dashboard de pasajero muestra:

- nombre del usuario autenticado;
- botón para pedir viaje;
- resumen de viajes por estado;
- lista real de viajes del pasajero;
- badge de estado para PENDING, IN_PROGRESS y COMPLETED;
- estados de carga, error y lista vacía.

## Uso

```bash
npm install
npm run dev
```

Variables de entorno:

```env
VITE_API_BASE_URL=http://localhost:8080
```
