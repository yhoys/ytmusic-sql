-- =============================================================================
-- YouTube Music SQL - Core Queries
-- =============================================================================
-- --------------------------------------------------------------------------------
-- Query 1: Exact duplicates - same title and artist
-- --------------------------------------------------------------------------------
SELECT title,
    artist,
    COUNT(*) AS total_copies,
    MIN(id) AS keep_id,
    MAX(id) AS remove_id
FROM songs
GROUP BY title,
    artist
HAVING COUNT(*) > 1
ORDER BY artist,
    title;

-- --------------------------------------------------------------------------------
-- Query 2: Case-insensitive duplicates - same title ignoring uppercase
-- --------------------------------------------------------------------------------
SELECT MIN(id) AS keep_id,
    MAX(id) AS remove_id,
    MIN(title) AS title_original,
    MAX(title) AS title_duplicate,
    MIN(artist) AS artist,
    COUNT(*) AS total_copies
FROM songs
GROUP BY LOWER(title),
    LOWER(artist)
HAVING COUNT(*) > 1
ORDER BY artist,
    title_original;

-- --------------------------------------------------------------------------------
-- Query 3: Fuzzy duplicates - similar title and same artist
-- Uses pg_trgm similarity to catch accent and spelling variations
-- unaccent() removes accents before comparing
-- 0 = completly different, 1 = identical
-- Threshold 0.6 catches most variations without too many false positives
-- --------------------------------------------------------------------------------
SELECT a.id AS id_a,
    a.title AS title_a,
    b.id AS id_b,
    b.title AS title_b,
    a.artist,
    ROUND(
        similarity(
            unaccent(LOWER(a.title)),
            unaccent(LOWER(b.title))
        )::NUMERIC,
        2
    ) AS score
FROM songs a
    JOIN songs b ON a.id < b.id
    AND LOWER(a.artist) = LOWER(b.artist)
    AND similarity(
        unaccent(LOWER(a.title)),
        unaccent(LOWER(b.title))
    ) > 0.6
ORDER BY score DESC;

-- --------------------------------------------------------------------------------
-- Query 4: Smart search before adding a new song
-- Run this before every INSERT to avoid duplicates
-- Replace the values in the WHERE clause with the song you want to add
-- --------------------------------------------------------------------------------
SELECT id,
    title,
    artist,
    album,
    yt_video_id,
    ROUND(
        similarity(
            unaccent(LOWER(title)),
            unaccent(LOWER('Blinding Lights'))
        )::NUMERIC,
        2
    ) AS score
FROM songs
WHERE similarity(
        unaccent(LOWER(title)),
        unaccent(LOWER('Blinding Lights'))
    ) > 0.5
    AND LOWER(artist) = LOWER('The Weeknd')
ORDER BY score DESC;

-- --------------------------------------------------------------------------------
-- Query 5: Safe delete - backup before removing a duplicate
-- Step 1: backup the song
-- Step 2: delete it
-- Run both steps together as a transaction
-- --------------------------------------------------------------------------------
BEGIN;

-- Step 1: save a snapshot to song_backups
INSERT INTO song_backups (
        song_id,
        title,
        artist,
        album,
        duration_sec,
        release_year,
        genre,
        yt_video_id,
        language,
        reason
    )
SELECT id,
    title,
    artist,
    album,
    duration_sec,
    release_year,
    genre,
    yt_video_id,
    language,
    'before_delete' -- or 'before_update' if modifying instead of deleting
FROM songs
WHERE id = 14;

-- Step 2: delete the duplicate
DELETE FROM songs
WHERE id = 14;

COMMIT;

-- --------------------------------------------------------------------------------
-- Query 6: View deleted or modified songs from backup
-- --------------------------------------------------------------------------------
SELECT sb.id AS backup_id,
    sb.song_id,
    sb.title,
    sb.artist,
    sb.album,
    sb.reason,
    sb.backed_up_at,
    CASE
        WHEN s.id IS NULL THEN 'deleted'
        ELSE 'still exists'
    END AS current_status
FROM song_backups sb
    LEFT JOIN songs s ON sb.song_id = s.id
ORDER BY sb.backed_up_at DESC;

-- --------------------------------------------------------------------------------
-- Query 7: Songs in Música que te gustó but not in any other playlist
-- These are liked songs that haven't been organized yet
-- --------------------------------------------------------------------------------
SELECT s.id,
    s.title,
    s.artist,
    s.language
FROM songs s
    JOIN playlist_songs ps ON s.id = ps.song_id
WHERE ps.playlist_id = 1
    AND s.id NOT IN (
        SELECT song_id
        FROM playlist_songs
        WHERE playlist_id != 1
    )
ORDER BY s.artist;