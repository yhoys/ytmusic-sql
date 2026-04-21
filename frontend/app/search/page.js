"use client";

import { useState } from "react";

export default function SearchPage() {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSearch() {
    if (!title.trim() || !artist.trim()) return;
    setLoading(true);
    setResults(null);
    const res = await fetch(
      `/api/songs/search?title=${encodeURIComponent(title)}&artist=${encodeURIComponent(artist)}`,
    );
    const data = await res.json();
    setResults(data);
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <h1 className="text-2xl font-bold text-white mb-2">
        Buscar antes de agregar
      </h1>
      <p className="text-gray-400 mb-8">
        Verifica si una canción ya existe en tu biblioteca
      </p>

      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 max-w-xl mb-8">
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Título</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Ej: Blinding Lights"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Artista</label>
            <input
              type="text"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Ej: The Weeknd"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={!title.trim() || !artist.trim() || loading}
            className="bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            {loading ? "Buscando..." : "Buscar"}
          </button>
        </div>
      </div>

      {results && (
        <div>
          {results.total === 0 ? (
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 max-w-xl">
              <p className="text-green-400 font-medium mb-1">
                ✓ No se encontró esta canción
              </p>
              <p className="text-gray-400 text-sm">
                Puedes agregarla sin riesgo de duplicado
              </p>
            </div>
          ) : (
            <div className="max-w-xl">
              <p className="text-yellow-400 text-sm mb-4">
                ⚠ Se encontraron {results.total} coincidencias
              </p>
              <div className="flex flex-col gap-3">
                {(results.results || []).map((song) => (
                  <div
                    key={song.id}
                    className="bg-gray-900 rounded-xl p-4 border border-gray-800 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-white font-medium">{song.title}</p>
                      <p className="text-gray-400 text-sm">{song.artist}</p>
                      <p className="text-gray-500 text-xs">{song.album}</p>
                    </div>
                    <span
                      className={`text-xs font-medium px-3 py-1 rounded-full ${
                        song.score >= 0.95
                          ? "bg-red-900 text-red-300"
                          : "bg-yellow-900 text-yellow-300"
                      }`}
                    >
                      {Math.round(song.score * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
