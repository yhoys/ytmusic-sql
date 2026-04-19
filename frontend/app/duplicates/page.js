import Link from "next/link";

async function getDuplicates() {
  const res = await fetch("http://127.0.0.1:8000/songs/duplicates", {
    cache: "no-store",
  });
  return res.json();
}

export default async function DuplicatesPage() {
  const data = await getDuplicates();

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <Link
        href="/"
        className="text-gray-400 text-sm hover:text-white mb-6 block"
      >
        ← Volver
      </Link>
      <h1 className="text-2xl font-bold text-white mb-2">Duplicados</h1>
      <p className="text-gray-400 mb-6">
        {data.total} pares de canciones similares detectados
      </p>

      {data.total === 0 ? (
        <div className="bg-gray-900 rounded-xl p-8 border border-gray-800 text-center">
          <p className="text-green-400 text-lg font-medium mb-2">
            ✓ Sin duplicados detectados
          </p>
          <p className="text-gray-400 text-sm">Tu biblioteca está limpia</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.duplicates.map((dup) => (
            <div
              key={`${dup.id_a}-${dup.id_b}`}
              className="bg-gray-900 rounded-xl p-5 border border-gray-800"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-400 text-xs">{dup.artist}</span>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    dup.score >= 0.95
                      ? "bg-red-900 text-red-300"
                      : "bg-yellow-900 text-yellow-300"
                  }`}
                >
                  {Math.round(dup.score * 100)}% similar
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">ID {dup.id_a}</p>
                  <p className="text-white text-sm font-medium">
                    {dup.title_a}
                  </p>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">ID {dup.id_b}</p>
                  <p className="text-white text-sm font-medium">
                    {dup.title_b}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
