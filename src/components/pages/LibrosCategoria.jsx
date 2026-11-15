import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { obtenerCategoria, obtenerLibrosPorCategoria } from '../../api/libreriaApi'
import Boton from '../Boton'
import Cargando from '../Cargando'
import MensajeError from '../MensajeError'
import TarjetaLibro from '../TarjetaLibro'

function LibrosCategoria() {
    const { categoriaId } = useParams()
    // El resultado guarda el id consultado para saber si corresponde a la ruta actual
    const [resultado, setResultado] = useState({ id: null })

    useEffect(() => {
        let activo = true
        // Las dos peticiones son independientes, se hacen en paralelo
        Promise.all([obtenerCategoria(categoriaId), obtenerLibrosPorCategoria(categoriaId)])
            .then(([categoria, libros]) => activo && setResultado({ id: categoriaId, categoria, libros, error: null }))
            .catch(error => activo && setResultado({ id: categoriaId, error }))
        return () => { activo = false }
    }, [categoriaId])

    const cargando = resultado.id !== categoriaId
    const { categoria, libros, error } = resultado

    if (cargando) {
        return <main className="contenedor"><Cargando mensaje="Cargando libros..." /></main>
    }

    if (error) {
        return (
            <main className="contenedor">
                <MensajeError mensaje={error.message}>
                    <Boton variante="secundario" to="/categorias">Volver a categorías</Boton>
                </MensajeError>
            </main>
        )
    }

    return (
        <main className="contenedor">
            <div className="mb-6">
                <h2 className="text-2xl font-bold">{categoria.nombre}</h2>
                <p className="text-gray-600">{categoria.descripcion}</p>
            </div>

            {libros.length === 0 ? (
                <div className="alerta-info">
                    Por ahora no hay libros en la categoría "{categoria.nombre}".
                </div>
            ) : (
                <div className="grilla">
                    {libros.map(libro => <TarjetaLibro key={libro.id} libro={libro} />)}
                </div>
            )}

            <div className="mt-6">
                <Boton variante="secundario" to="/categorias">Volver a categorías</Boton>
            </div>
        </main>
    )
}

export default LibrosCategoria
