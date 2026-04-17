# YouTube Music SQL

Sistema en PostgreSQL para gestionar y limpiar una biblioteca personal de YouTube Music. Detecta canciones duplicadas, mantiene un respaldo automático antes de eliminar, y permite buscar antes de agregar una canción nueva.

Diseñado para escalar: aunque arranca solo con SQL, la estructura está pensada para agregar un backend en Python + FastAPI, un frontend en React/Next.js, integración directa con YouTube Music y Docker.

---

## Estado del proyecto

| Fase | Descripción              | Estado       |
| ---- | ------------------------ | ------------ |
| 1    | Base de datos PostgreSQL | ✅ Completo  |
| 2    | Backend Python + FastAPI | 🔜 Próximo   |
| 3    | Frontend React / Next.js | 🔜 Pendiente |
| 4    | Docker + despliegue      | 🔜 Pendiente |
| 5    | IA para recomendaciones  | 🔜 Pendiente |

---

## El problema que resuelve

Al usar YouTube Music durante mucho tiempo es fácil acumular canciones duplicadas: la misma canción con el título escrito diferente, con o sin tilde, con mayúsculas distintas. Este sistema detecta esos casos y permite limpiarlos de forma segura sin perder información.

---

## Estructura del proyecto

    ytmusic-sql/
    ├── README.md
    └── sql/
        ├── 01_schema.sql       # Tablas, índices, extensiones
        ├── 02_seed_data.sql    # Datos de prueba con duplicados intencionales
        └── 03_queries.sql      # Consultas de detección, búsqueda y limpieza

---

## Schema

| Tabla            | Descripción                                        |
| ---------------- | -------------------------------------------------- |
| `songs`          | Catálogo central, cada canción existe una sola vez |
| `playlists`      | Las playlists del usuario                          |
| `playlist_songs` | Relación entre canciones y playlists               |
| `song_backups`   | Respaldo automático antes de modificar o eliminar  |

---

## Cómo ejecutar

### Requisitos

- PostgreSQL 14+
- DBeaver o cualquier cliente SQL

### Pasos

```sql
-- 1. Crear la base de datos
CREATE DATABASE ytmusic_sql;

-- 2. Crear extensiones (requiere superusuario)
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

-- 3. Ejecutar los archivos en orden
-- 01_schema.sql → 02_seed_data.sql → 03_queries.sql
```

---

## Consultas incluidas

| #   | Consulta                      | Descripción                         |
| --- | ----------------------------- | ----------------------------------- |
| 1   | Duplicados exactos            | Mismo título y artista              |
| 2   | Duplicados por capitalización | `bad guy` vs `Bad Guy`              |
| 3   | Duplicados fuzzy              | `Hawái` vs `Hawaii`                 |
| 4   | Búsqueda inteligente          | Buscar antes de agregar             |
| 5   | Eliminación segura            | Backup automático antes de borrar   |
| 6   | Ver eliminadas                | Canciones borradas con su historial |
| 7   | Sin playlist                  | Canciones en me gusta sin organizar |

---

## Decisiones de diseño

**¿Por qué `song_backups` duplica las columnas de `songs`?**
Porque si se elimina una canción, la referencia `song_id` queda en `NULL`. El snapshot debe ser autónomo para poder recuperar los datos aunque la fila original ya no exista.

**¿Por qué `yt_video_id` tiene `UNIQUE` pero `title` no?**
Porque dos canciones pueden tener el mismo título pero son videos distintos en YouTube. El `yt_video_id` es el único identificador verdaderamente único.

**¿Por qué índices de trigramas en `title` y `artist`?**
Para que las búsquedas con `similarity()` usen el índice en lugar de revisar toda la tabla fila por fila. Con cientos de canciones la diferencia es significativa.

---

## Stack tecnológico

| Capa                          | Tecnología       |
| ----------------------------- | ---------------- |
| Base de datos                 | PostgreSQL 14+   |
| Backend (fase 2)              | Python + FastAPI |
| Frontend (fase 3)             | React / Next.js  |
| Integración YT Music (fase 2) | ytmusicapi       |
| Contenedores (fase 4)         | Docker           |
| Control de versiones          | Git + GitHub     |
