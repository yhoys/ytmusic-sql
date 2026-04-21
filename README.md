# YouTube Music SQL

Sistema en PostgreSQL para gestionar y limpiar una biblioteca personal de YouTube Music. Detecta canciones duplicadas, mantiene un respaldo automático antes de eliminar, y permite buscar antes de agregar una canción nueva.

Diseñado para escalar: aunque arranca solo con SQL, la estructura está pensada para agregar un backend en Python + FastAPI, un frontend en React/Next.js, integración directa con YouTube Music y Docker.

---

## Estado del proyecto

| Fase | Descripción              | Estado       |
| ---- | ------------------------ | ------------ |
| 1    | Base de datos PostgreSQL | ✅ Completo  |
| 2    | Backend Python + FastAPI | ✅ Completo  |
| 3    | Frontend React / Next.js | ✅ Completo  |
| 4    | Docker + despliegue      | 🔜 Próximo   |
| 5    | IA para recomendaciones  | 🔜 Pendiente |

---

## El problema que resuelve

Al usar YouTube Music durante mucho tiempo es fácil acumular canciones duplicadas: la misma canción con el título escrito diferente, con o sin tilde, con mayúsculas distintas. Este sistema detecta esos casos y permite limpiarlos de forma segura sin perder información.

---

## Estructura del proyecto

    ytmusic-sql/
    ├── README.md
    ├── .env                        # Credenciales locales (no en GitHub)
    ├── auth/
    │   └── browser.json            # Credenciales ytmusicapi (no en GitHub)
    ├── backend/
    │   ├── ytmusic_import.py       # Importa canciones desde YouTube Music
    │   ├── export.py               # Exporta biblioteca a Excel (script)
    │   ├── test_connection.py      # Verifica conexión a PostgreSQL
    │   └── app/
    │       ├── main.py             # API FastAPI con todos los endpoints
    │       └── database.py         # Conexión a PostgreSQL
    ├── frontend/
    │   └── app/
    │       ├── layout.js           # Navbar global
    │       ├── page.js             # Dashboard principal
    │       ├── songs/
    │       │   └── page.js         # Lista de canciones con búsqueda y paginación
    │       ├── playlists/
    │       │   └── [id]/
    │       │       └── page.js     # Detalle de playlist
    │       ├── duplicates/
    │       │   └── page.js         # Detección de duplicados
    │       ├── search/
    │       │   └── page.js         # Búsqueda antes de agregar
    │       └── components/
    │           └── PlaylistsSection.js
    └── sql/
        ├── 01_schema.sql           # Tablas, índices, extensiones
        ├── 02_seed_data.sql        # Datos de prueba
        └── 03_queries.sql          # Consultas de detección y limpieza

---

## Requisitos

- PostgreSQL 14+
- Python 3.11+
- DBeaver o cualquier cliente SQL

## Instalación

### 1. Clonar el repositorio

    git clone https://github.com/TU_USUARIO/ytmusic-sql.git
    cd ytmusic-sql

### 2. Crear el entorno virtual

    python -m venv .venv
    .venv\Scripts\activate       # Windows
    source .venv/bin/activate    # Mac/Linux

### 3. Instalar dependencias

    pip install fastapi uvicorn psycopg2-binary python-dotenv ytmusicapi

### 4. Configurar credenciales

Crea un archivo `.env` en la raíz del proyecto:

    DB_HOST=localhost
    DB_PORT=5432
    DB_NAME=ytmusic_sql
    DB_USER=ytmusic_user
    DB_PASSWORD=tu_contraseña

### 5. Crear la base de datos

Ejecuta en PostgreSQL con el usuario superusuario:

    CREATE DATABASE ytmusic_sql;
    CREATE EXTENSION IF NOT EXISTS pg_trgm;
    CREATE EXTENSION IF NOT EXISTS unaccent;

Luego ejecuta los archivos SQL en orden:

    sql/01_schema.sql
    sql/02_seed_data.sql

### 6. Correr el servidor

    uvicorn backend.app.main:app --reload

La API queda disponible en `http://127.0.0.1:8000`.
La documentación automática en `http://127.0.0.1:8000/docs`.

### 7. Importar tu biblioteca de YouTube Music

    ytmusicapi browser    # Autenticar con tu cuenta
    python backend/ytmusic_import.py

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

## API endpoints

| Método | Endpoint                       | Descripción                                 |
| ------ | ------------------------------ | ------------------------------------------- |
| GET    | `/`                            | Health check                                |
| GET    | `/songs`                       | Todas las canciones                         |
| GET    | `/songs/search?title=&artist=` | Búsqueda inteligente antes de agregar       |
| GET    | `/songs/duplicates`            | Canciones duplicadas con score de similitud |
| POST   | `/songs`                       | Agregar canción con verificación automática |
| GET    | `/playlists`                   | Playlists con conteo de canciones           |
| GET    | `/export`                      | Descarga la biblioteca completa en Excel    |
| GET    | `/playlists/{id}/songs`        | Canciones de una playlist específica        |

## Importación desde YouTube Music

El script `backend/ytmusic_import.py` conecta directamente con tu cuenta de YouTube Music usando `ytmusicapi` y:

- Importa todas tus playlists y canciones automáticamente
- Detecta canciones ya existentes antes de insertar (por `yt_video_id` y similitud de título)
- Evita duplicados usando `ON CONFLICT DO NOTHING`
- Mapea nombres de playlists autogeneradas (`Liked Music` → `Música que te gustó`)
- Es seguro de ejecutar múltiples veces sin crear duplicados

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
