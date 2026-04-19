import Link from "next/link";
import PlaylistsSection from "./components/PlaylistsSection";

async function getStats() {
  const res = await fetch("http://127.0.0.1:8000/stats", {
    cache: "no-store",
  });
  return res.json();
}

export default async function Home() {
  const stats = await getStats();

  const cards = [
    { label: "Canciones", value: stats.total_songs, href: "/songs" },
    { label: "Artistas", value: stats.total_artists, href: null },
    { label: "Playlists", value: stats.total_playlists, href: null },
    {
      label: "Sin organizar",
      value: stats.unorganized_songs,
      href: "/duplicates",
    },
  ];

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <h1 className="text-3xl font-bold text-red-500 mb-2">
        YouTube Music SQL
      </h1>
      <p className="text-gray-400 mb-8">
        Tu biblioteca personal gestionada con PostgreSQL
      </p>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 mb-10">
        {cards.map((card) =>
          card.href ? (
            <Link
              key={card.label}
              href={card.href}
              className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-red-500 transition-colors"
            >
              <p className="text-gray-400 text-sm mb-1">{card.label}</p>
              <p className="text-3xl font-bold text-white">{card.value}</p>
            </Link>
          ) : (
            <div
              key={card.label}
              className="bg-gray-900 rounded-xl p-6 border border-gray-800"
            >
              <p className="text-gray-400 text-sm mb-1">{card.label}</p>
              <p className="text-3xl font-bold text-white">{card.value}</p>
            </div>
          ),
        )}
      </div>

      <h2 className="text-xl font-semibold text-white mb-4">Playlists</h2>
      <PlaylistsSection />
    </main>
  );
}
