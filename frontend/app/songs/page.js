import Link from "next/link";

async function getSongs() {
  const res = await fetch("http://127.0.0.1:8000/songs", {
    cache: "no-store",
  });
  return res.json();
}

export default async function SongsPage() {
  const data = await getSongs();

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <Link
        href="/"
        className="text-gray-400 text-sm hover:text-white mb-6 block"
      >
        ← Volver
      </Link>
      <h1 className="text-2xl font-bold text-white mb-2">Canciones</h1>
      <p className="text-gray-400 mb-6">
        {data.total} canciones en tu biblioteca
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-gray-400 text-left">
              <th className="pb-3 pr-4">Título</th>
              <th className="pb-3 pr-4">Artista</th>
              <th className="pb-3 pr-4">Álbum</th>
              <th className="pb-3">Idioma</th>
            </tr>
          </thead>
          <tbody>
            {data.songs.map((song) => (
              <tr
                key={song.id}
                className="border-b border-gray-900 hover:bg-gray-900 transition-colors"
              >
                <td className="py-3 pr-4 text-white">{song.title}</td>
                <td className="py-3 pr-4 text-gray-300">{song.artist}</td>
                <td className="py-3 pr-4 text-gray-400">{song.album || "—"}</td>
                <td className="py-3 text-gray-400">{song.language || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
