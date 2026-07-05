# Uber E2E Frontend — Bloques 1, 2 y 3

Este ZIP contiene el frontend acumulado hasta el Bloque 3.

## Incluye

- Bloque 1: base React + TypeScript + Vite y UI limpia estilo Uber.
- Bloque 2: login y registro funcionales contra el backend.
- Bloque 3: sesión persistente, recuperación del usuario actual, logout y rutas protegidas por rol.

## Rutas principales

- `/login`
- `/register`
- `/passenger/dashboard`
- `/driver/dashboard`

## Cómo ejecutar

```powershell
cd frontend
npm install
Copy-Item .env.example .env
npm run dev
```

El backend debe estar levantado en:

```text
http://localhost:8080
```

Si tu backend usa otro puerto, edita `.env`.

## Importante para actualizar

Al copiar este bloque sobre uno anterior, conserva tu archivo `.env` si ya lo configuraste. No subas `node_modules/` ni `.env` a GitHub.
