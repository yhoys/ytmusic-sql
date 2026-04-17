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