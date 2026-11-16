import { Link } from 'react-router'
import { RUTAS, precargar } from '../../api/libreriaApi'
import { useConsulta } from '../../hooks/useConsulta'
import Boton from '../Boton'
import MensajeError from '../MensajeError'

function Home() {
    // Misma consulta que la página de categorías: al navegar entre ambas se reutiliza la caché
    const { datos: categorias, cargando, error, recargar } = useConsulta(RUTAS.categorias)

    return (
        <main className="contenedor">
            <section className="tarjeta mb-8 bg-marca-50 p-8 text-center">
                <h2 className="mb-3 text-3xl font-bold text-marca-900">Bienvenido a Entre Líneas</h2>
                <p className="mx-auto mb-6 max-w-xl text-gray-700">
                    Explora nuestro catálogo por categorías: ficción, ciencia ficción, fantasía, misterio y más.
                    Encuentra tu próxima lectura y revisa el detalle de cada libro.
                </p>
                <Boton to="/categorias">Explorar categorías</Boton>
            </section>

            <section>
                <h3 className="mb-3 text-lg font-semibold">Accesos rápidos</h3>

                {cargando && (
                    <div role="status" aria-label="Cargando categorías" className="flex animate-pulse flex-wrap gap-2">
                        {Array.from({ length: 6 }, (_, i) => (
                            <span key={i} className="h-9 w-28 rounded-full bg-gray-200" />
                        ))}
                    </div>
                )}

                {error && !categorias && <MensajeError error={error} onReintentar={recargar} />}

                {categorias && (
                    <ul className="flex flex-wrap gap-2">
                        {categorias.map(({ id, nombre }) => (
                            <li key={id}>
                                <Link
                                    to={`/categorias/${id}`}
                                    onMouseEnter={() => precargar(RUTAS.librosCategoria(id))}
                                    className="block rounded-full border border-marca-300 bg-white px-4 py-2 text-sm font-medium text-marca-800 hover:bg-marca-50"
                                >
                                    {nombre}
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </main>
    )
}

export default Home
