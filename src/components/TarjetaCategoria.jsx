import { Link } from 'react-router'
import { RUTAS, precargar } from '../api/libreriaApi'

function TarjetaCategoria({ categoria }) {
    const { id, nombre, descripcion, cantidadLibros } = categoria
    // Al pasar el mouse (o enfocar con teclado) se piden los libros por adelantado
    const precargarLibros = () => precargar(RUTAS.librosCategoria(id))

    return (
        <Link
            to={`/categorias/${id}`}
            onMouseEnter={precargarLibros}
            onFocus={precargarLibros}
            className="tarjeta block p-5 transition-shadow hover:border-marca-300 hover:shadow-md"
        >
            <h3 className="mb-1 text-lg font-semibold text-marca-800">{nombre}</h3>
            <p className="mb-3 text-sm text-gray-600">{descripcion}</p>
            <span className="text-sm font-medium text-gray-500">
                {cantidadLibros === 1 ? '1 libro' : `${cantidadLibros} libros`}
            </span>
        </Link>
    )
}

export default TarjetaCategoria
