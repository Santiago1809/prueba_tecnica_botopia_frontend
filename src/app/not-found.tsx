import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <div className="space-y-6">
          <h2 className="text-3xl font-semibold text-gray-800">
            Página no encontrada
          </h2>
          <p className="text-gray-600 max-w-lg mx-auto">
            Lo sentimos, no pudimos encontrar la página que estás buscando.
            Puede que haya sido movida o no exista.
          </p>
          <Link
            href="/"
            className="inline-block bg-slate-900 text-white px-6 py-3 rounded-lg hover:bg-slate-800 transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
