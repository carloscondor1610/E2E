# Bloque 1 — Base del frontend E2E

Este avance crea la base del frontend en una carpeta independiente llamada `frontend/`.

## Qué incluye

- React + TypeScript + Vite.
- React Router configurado.
- `AuthProvider` para restaurar sesión con `GET /users/me` si existe token.
- `apiRequest()` centralizado con `Authorization: Bearer <token>`.
- Tipos iniciales: `User`, `Trip`, `Role`, `TripStatus`.
- Rutas base:
  - `/login`
  - `/register`
  - `/passenger/dashboard`
  - `/driver/dashboard`
- Rutas protegidas por rol.
- Layout con navbar y logout.

## Cómo colocarlo en tu repo

Copia o descomprime la carpeta `frontend/` dentro de la raíz del backend.

La estructura final debe quedar así:

```txt
cs2031-2026-1-week14-e2e-2-main/
├── frontend/
├── src/
├── pom.xml
├── mvnw
└── README.md
```

## Qué NO debes eliminar

No elimines estas partes del backend:

```txt
src/
pom.xml
mvnw
mvnw.cmd
.mvn/
README.md
CLAUDE.md
```

En los siguientes bloques, normalmente solo tendrás que reemplazar la carpeta `frontend/` por la nueva versión acumulada.

## Cómo ejecutarlo

Backend:

```bash
./mvnw spring-boot:run
```

Frontend:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Abre:

```txt
http://localhost:5173
```

## Nota importante

Este bloque todavía no implementa el formulario real de login/registro. Eso entra en el Bloque 2.
Por ahora, deja lista la arquitectura para que el login pueda guardar el token, cargar `/users/me` y redirigir por rol.
