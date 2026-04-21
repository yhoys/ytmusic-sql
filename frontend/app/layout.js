import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "YouTube Music SQL",
  description: "Tu biblioteca personal gestionada con PostgreSQL",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="bg-gray-950 text-white">
        <nav className="bg-gray-900 border-b border-gray-800 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <Link href="/" className="text-red-500 font-bold text-lg">
            YT Music SQL
          </Link>
          <div className="flex items-center gap-6 text-sm">
            <Link
              href="/"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/songs"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Canciones
            </Link>
            <Link
              href="/duplicates"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Duplicados
            </Link>
            <Link
              href="/search"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Buscar
            </Link>
            <a
              href="http://127.0.0.1:8000/export"
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-lg transition-colors"
            >
              Exportar
            </a>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
