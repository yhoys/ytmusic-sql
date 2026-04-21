# YouTube Music SQL — Frontend

Frontend del proyecto [YouTube Music SQL](../README.md), construido con Next.js 16 y Tailwind CSS.

## Páginas

| Ruta              | Descripción                              |
| ----------------- | ---------------------------------------- |
| `/`               | Dashboard con stats y playlists          |
| `/songs`          | Lista de canciones con búsqueda y orden  |
| `/playlists/[id]` | Detalle de playlist                      |
| `/duplicates`     | Detección de duplicados con score visual |
| `/search`         | Búsqueda antes de agregar una canción    |

## Correr en desarrollo

```bash
npm install
npm run dev
```

Disponible en `http://localhost:3000`. Requiere el backend corriendo en `http://localhost:8000`.
