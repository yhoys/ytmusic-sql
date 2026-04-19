"use client";

import Link from "next/link";
import { useEffect, useState, useMemo } from "react";

export default function SongsPage() {
  const [songs, setSongs] = useState([]);
  const [search, setSearch] = useState("");
  const [sortCol, setSortCol] = useState("artist");
  const [sortDir, setSortDir] = useState("asc");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/songs")
      .then((res) => res.json())
      .then((data) => {
        setSongs(data.songs);
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    let result = [...songs];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.title?.toLowerCase().includes(q) ||
          s.artist?.toLowerCase().includes(q) ||
          s.album?.toLowerCase().includes(q),
      );
    }

    result.sort((a, b) => {
      const valA = (a[sortCol] || "").toLowerCase();
      const valB = (b[sortCol] || "").toLowerCase();
      if (valA < valB) return sortDir === "asc" ? -1 : 1;
      if (valA > valB) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [search, sortCol, sortDir, songs]);

  function handleSort(col) {
    if (sortCol === col) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortCol(col);
      setSortDir("asc");
    }
  }

  function SortIcon({ col }) {
    if (sortCol !== col) return <span className="text-gray-600 ml-1">↕</span>;
    return (
      <span className="text-red-400 ml-1">{sortDir === "asc" ? "↑" : "↓"}</span>
    );
  }

  const columns = [
    { key: "title", label: "Título" },
    { key: "artist", label: "Artista" },
    { key: "album", label: "Álbum" },
    { key: "language", label: "Idioma" },
  ];

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <Link
        href="/"
        className="text-gray-400 text-sm hover:text-white mb-6 block"
      >
        ← Volver
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Canciones</h1>
          <p className="text-gray-400 text-sm mt-1">
            {loading
              ? "Cargando..."
              : `${filtered.length} de ${songs.length} canciones`}
          </p>
        </div>

        <input
          type="text"
          placeholder="Buscar por título, artista o álbum..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500 w-80"
        />
      </div>

      {loading ? (
        <div className="text-center text-gray-400 py-20">
          Cargando canciones...
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 text-left">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="pb-3 pr-4 cursor-pointer hover:text-white select-none"
                    onClick={() => handleSort(col.key)}
                  >
                    {col.label}
                    <SortIcon col={col.key} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((song) => (
                <tr
                  key={song.id}
                  className="border-b border-gray-900 hover:bg-gray-900 transition-colors"
                >
                  <td className="py-3 pr-4 text-white">{song.title}</td>
                  <td className="py-3 pr-4 text-gray-300">{song.artist}</td>
                  <td className="py-3 pr-4 text-gray-400">
                    {song.album || "—"}
                  </td>
                  <td className="py-3 text-gray-400">{song.language || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="text-center text-gray-500 py-16">
              No se encontraron canciones para &quot;{search}&quot;
            </div>
          )}
        </div>
      )}
    </main>
  );
}
