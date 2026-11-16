import { useParams } from 'react-router'
import { RUTAS } from '../../api/libreriaApi'
import { useConsulta } from '../../hooks/useConsulta'
import BarraConsulta from '../BarraConsulta'
import Boton from '../Boton'
import EsqueletoTarjetas from '../EsqueletoTarjetas'
import MensajeError from '../MensajeError'
import TarjetaLibro from '../TarjetaLibro'

function LibrosCategoria() {
    const { categoriaId } = useParams()
    // Dos consultas independientes que se hacen en paralelo.
    // Si se viene desde la lista de categorías, la categoría ya está en caché y se muestra al instante.
    const categoria = useConsulta(RUTAS.categoria(categoriaId))
    const libros = useConsulta(RUTAS.librosCategoria(categoriaId))

    const volver = <Boton variante="secundario" to="/categorias">Volver a categorías</Boton>

    // Un 404 en cualquiera de las dos consultas significa que la categoría no existe
    const noExiste = [categoria.error, libros.error].find(error => error?.tipo === 'noEncontrado')
    if (noExiste) {
        return (
            <main className="contenedor">
                <MensajeError error={noExiste}>{volver}</MensajeError>
            </main>
        )
    }

    // Error sin datos de respaldo en alguna de las consultas
    const errorSinDatos = (!categoria.datos && categoria.error) || (!libros.datos && libros.error)
    const reintentar = () => {
        if (categoria.error) categoria.recargar()
        if (libros.error) libros.recargar()
    }

    return (
        <main className="contenedor">
            <div className="mb-6">
                {categoria.datos ? (
                    <>
                        <h2 className="text-2xl font-bold">{categoria.datos.nombre}</h2>
                        <p className="text-gray-600">{categoria.datos.descripcion}</p>
                    </>
                ) : categoria.cargando ? (
                    <div role="status" aria-label="Cargando categoría" className="animate-pulse">
                        <div className="mb-2 h-7 w-48 rounded bg-gray-200" />
                        <div className="h-4 w-72 rounded bg-gray-200" />
                    </div>
                ) : (
                    <h2 className="text-2xl font-bold">Categoría</h2>
                )}
            </div>

            {errorSinDatos && (
                <div className="mb-6">
                    <MensajeError error={errorSinDatos} onReintentar={reintentar}>{volver}</MensajeError>
                </div>
            )}

            {libros.cargando && <EsqueletoTarjetas cantidad={3} mensaje="Cargando libros..." />}

            {libros.datos && (
                <>
                    <BarraConsulta
                        consulta={libros}
                        texto={libros.datos.length === 1 ? '1 libro' : `${libros.datos.length} libros`}
                    />
                    {libros.datos.length === 0 ? (
                        <div className="alerta-info">
                            Por ahora no hay libros en esta categoría. Revisa las demás categorías del catálogo.
                        </div>
                    ) : (
                        <div className="grilla">
                            {libros.datos.map(libro => <TarjetaLibro key={libro.id} libro={libro} />)}
                        </div>
                    )}
                </>
            )}

            {!errorSinDatos && <div className="mt-6">{volver}</div>}
        </main>
    )
}

export default LibrosCategoria
