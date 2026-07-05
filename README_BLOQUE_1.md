# Bloque 1 — Base frontend + UI estilo Uber

Este bloque deja preparada la base React + TypeScript del frontend y actualiza las pantallas de `login` y `registro` para que se vean más como una app/web tipo Uber.

## Qué incluye

- React + TypeScript + Vite.
- React Router.
- `apiRequest()` centralizado en `src/api/http.ts`.
- Manejo base de JWT en `localStorage`.
- `AuthProvider` y rutas protegidas por rol.
- Tipos base para usuario, auth y viajes.
- Layout principal con barra superior estilo Uber.
- Pantallas visuales de login y registro estilo Uber.

## Importante

En este bloque los formularios de login y registro todavía están deshabilitados porque la conexión real con:

- `POST /auth/login`
- `POST /auth/register`
- `GET /users/me`

se implementará en el Bloque 2.

## Cómo probar

```bash
cd frontend
npm install
Copy-Item .env.example .env
npm run dev
```

Luego abre:

```txt
http://localhost:5173
```

## Qué no debes borrar del proyecto raíz

No elimines:

```txt
src/
pom.xml
mvnw
mvnw.cmd
.mvn/
README.md
CLAUDE.md
```

Para actualizar este bloque, puedes reemplazar únicamente la carpeta:

```txt
frontend/
```
