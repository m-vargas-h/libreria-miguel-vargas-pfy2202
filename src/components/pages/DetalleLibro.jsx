import { Link, useParams } from 'react-router'
import { RUTAS } from '../../api/libreriaApi'
import { useConsulta } from '../../hooks/useConsulta'
import { formatearPrecio } from '../../utils/formato'
import AvisoRespaldo from '../AvisoRespaldo'
import Boton from '../Boton'
import Cargando from '../Cargando'
import IndicadorActualizando from '../IndicadorActualizando'
import MensajeError from '../MensajeError'

function DetalleLibro() {
    const { libroId } = useParams()
    const { datos: libro, cargando, actualizando, error, desdeRespaldo, fechaRespaldo, recargar } = useConsulta(RUTAS.libro(libroId))

    if (cargando) {
        return <main className="contenedor"><Cargando mensaje="Cargando libro..." /></main>
    }

    if (error && !libro) {
        return (
            <main className="contenedor">
                <MensajeError error={error} onReintentar={recargar}>
                    <Boton variante="secundario" to="/categorias">Ver categorías</Boton>
                </MensajeError>
            </main>
        )
    }

    return (
        <main className="contenedor">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <nav className="text-sm text-gray-600">
                    <Link to="/categorias" className="enlace">Categorías</Link>
                    {' / '}
                    <Link to={`/categorias/${libro.categoria.id}`} className="enlace">{libro.categoria.nombre}</Link>
                </nav>
                {actualizando && <IndicadorActualizando />}
            </div>

            {desdeRespaldo && <AvisoRespaldo error={error} fecha={fechaRespaldo} onReintentar={recargar} />}

            <article className="tarjeta max-w-2xl overflow-hidden">
                <div className="bg-marca-700 px-5 py-3 text-white">
                    <h2 className="text-xl font-bold">{libro.titulo}</h2>
                    <p className="text-marca-100">{libro.autor}</p>
                </div>
                <div className="p-5">
                    <p className="mb-4 text-gray-700">{libro.descripcion}</p>
                    <ul className="mb-4 divide-y divide-gray-200 border-y border-gray-200">
                        <li className="py-2"><strong>Categoría:</strong> {libro.categoria.nombre}</li>
                        <li className="py-2"><strong>Año de publicación:</strong> {libro.anio}</li>
                        <li className="py-2"><strong>Páginas:</strong> {libro.paginas}</li>
                        <li className="py-2"><strong>Precio:</strong> {formatearPrecio(libro.precio)}</li>
                    </ul>
                    <Boton variante="secundario" to={`/categorias/${libro.categoria.id}`}>
                        Volver a {libro.categoria.nombre}
                    </Boton>
                </div>
            </article>
        </main>
    )
}

export default DetalleLibro
