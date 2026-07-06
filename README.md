# Uber E2E Frontend — avance acumulado completo

Este ZIP incluye el frontend acumulado hasta los 7 incisos de la rúbrica.

## Incisos cubiertos

1. Login / Registro con JWT, localStorage, Bearer token y redirección por rol.
2. Dashboard pasajero con GET /trips.
3. Solicitar viaje con GET /drivers/available y POST /trips.
4. Detalle pasajero con GET /trips/{id}, polling y calificación.
5. Dashboard conductor con rating, GET /trips/pending, GET /trips/my y PATCH /trips/{id}/accept.
6. Detalle conductor con GET /trips/{id} y PATCH /trips/{id}/complete.
7. Historial para ambos roles con filtro por estado.

## Actualización segura

Dentro de frontend/, conserva solo:

- .env
- node_modules/

Reemplaza todo lo demás con el contenido de este ZIP.

## Comandos

```powershell
npm install
npm run dev
```

## Prueba rápida

1. Ingresa como pasajero y crea un viaje. (utiliza el usuario ya planeado como conductor y pasajero previamente)
2. Cierra sesión.
3. Ingresa como conductor.
4. Acepta el viaje pendiente.
5. Completa el viaje.
6. Cierra sesión e ingresa nuevamente como pasajero.
7. Abre el detalle del viaje completado y califica.
8. Revisa Historial y filtra por estado.


