"use client";

import Link from "next/link";
import { useEffect, useState, useMemo, use } from "react";

const PAGE_SIZE = 50;

export default function PlaylistPage({ params }) {
    const { id } = use(params);
    const [data, setData] = useState(null);
    const [search, setSearch] = useState("");
    const [sortCol, setSortCol] = useState("artist");
    const [sortDir, setSortDir] = useState("asc");
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/playlists/${id}/songs`)
            .then((res) => res.json())
            .then((d) => {
                setData(d);
                setLoading(false);
            });
    }, [id]);

    const filtered = useMemo(() => {
        if (!data) return [];
        let result = [...data.songs];

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
    }, [search, sortCol, sortDir, data]);

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    function handleSort(col) {
        if (sortCol === col) {
            setSortDir(sortDir === "asc" ? "desc" : "asc");
        } else {
            setSortCol(col);
            setSortDir("asc");
        }
        setPage(1);
    }

    function SortIcon({ col }) {
        if (sortCol !== col)
            return <span className="text-gray-600 ml-1">↕</span>;
        return (
            <span className="text-red-400 ml-1">
                {sortDir === "asc" ? "↑" : "↓"}
            </span>
        );
    }

    const columns = [
        { key: "title", label: "Título" },
        { key: "artist", label: "Artista" },
        { key: "album", label: "Álbum" },
        { key: "language", label: "Idioma" },
    ];

    if (loading) {
        return (
            <main className="min-h-screen bg-gray-950 text-white p-8">
                <div className="text-center text-gray-400 py-20">
                    Cargando...
                </div>
            </main>
        );
    }

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
                    <h1 className="text-2xl font-bold text-white">
                        {data.playlist.name}
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">
                        {filtered.length} de {data.total} canciones
                    </p>
                </div>

                <input
                    type="text"
                    placeholder="Buscar en esta playlist..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                    }}
                    className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500 w-80"
                />
            </div>

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
                        {paginated.map((song) => (
                            <tr
                                key={song.id}
                                className="border-b border-gray-900 hover:bg-gray-900 transition-colors"
                            >
                                <td className="py-3 pr-4 text-white">
                                    {song.title}
                                </td>
                                <td className="py-3 pr-4 text-gray-300">
                                    {song.artist}
                                </td>
                                <td className="py-3 pr-4 text-gray-400">
                                    {song.album || "—"}
                                </td>
                                <td className="py-3 text-gray-400">
                                    {song.language || "—"}
                                </td>
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

            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                    <p className="text-gray-400 text-sm">
                        Página {page} de {totalPages}
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-4 py-2 text-sm rounded-lg bg-gray-900 border border-gray-700 hover:border-red-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            ← Anterior
                        </button>
                        <button
                            onClick={() =>
                                setPage((p) => Math.min(totalPages, p + 1))
                            }
                            disabled={page === totalPages}
                            className="px-4 py-2 text-sm rounded-lg bg-gray-900 border border-gray-700 hover:border-red-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            Siguiente →
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}
