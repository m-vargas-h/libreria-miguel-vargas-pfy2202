import { useEffect, useState } from 'react'
import { obtenerCategorias } from '../../api/libreriaApi'
import Cargando from '../Cargando'
import MensajeError from '../MensajeError'
import TarjetaCategoria from '../TarjetaCategoria'

function Categorias() {
    const [resultado, setResultado] = useState({ categorias: null, error: null })

    useEffect(() => {
        // Evita actualizar el estado si el componente se desmonta antes de que llegue la respuesta
        let activo = true
        obtenerCategorias()
            .then(categorias => activo && setResultado({ categorias, error: null }))
            .catch(error => activo && setResultado({ categorias: null, error }))
        return () => { activo = false }
    }, [])

    const { categorias, error } = resultado
    const cargando = !categorias && !error

    return (
        <main className="contenedor">
            <h2 className="titulo-pagina">Categorías</h2>

            {cargando && <Cargando mensaje="Cargando categorías..." />}

            {error && <MensajeError mensaje={error.message} />}

            {categorias && (
                <div className="grilla">
                    {categorias.map(categoria => (
                        <TarjetaCategoria key={categoria.id} categoria={categoria} />
                    ))}
                </div>
            )}
        </main>
    )
}

export default Categorias
