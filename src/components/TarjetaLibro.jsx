import { Link } from 'react-router'
import { formatearPrecio } from '../utils/formato'

function TarjetaLibro({ libro }) {
    const { id, titulo, autor, precio, anio } = libro

    return (
        <article className="tarjeta flex flex-col p-5">
            <h3 className="text-lg font-semibold">{titulo}</h3>
            <p className="mb-3 text-sm text-gray-600">{autor} · {anio}</p>
            <div className="mt-auto flex items-center justify-between gap-2">
                <span className="font-bold text-marca-800">{formatearPrecio(precio)}</span>
                <Link to={`/libros/${id}`} className="enlace text-sm">Ver detalle →</Link>
            </div>
        </article>
    )
}

export default TarjetaLibro
