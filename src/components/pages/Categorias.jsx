import { RUTAS } from '../../api/libreriaApi'
import { useConsulta } from '../../hooks/useConsulta'
import BarraConsulta from '../BarraConsulta'
import Boton from '../Boton'
import EsqueletoTarjetas from '../EsqueletoTarjetas'
import MensajeError from '../MensajeError'
import TarjetaCategoria from '../TarjetaCategoria'

function Categorias() {
    const consulta = useConsulta(RUTAS.categorias)
    const { datos: categorias, cargando, error, recargar } = consulta

    return (
        <main className="contenedor">
            <h2 className="titulo-pagina">Categorías</h2>

            {cargando && <EsqueletoTarjetas cantidad={6} mensaje="Cargando categorías..." />}

            {error && !categorias && (
                <MensajeError error={error} onReintentar={recargar}>
                    <Boton variante="secundario" to="/">Volver al inicio</Boton>
                </MensajeError>
            )}

            {categorias && (
                <>
                    <BarraConsulta consulta={consulta} texto={`${categorias.length} categorías disponibles`} />
                    <div className="grilla">
                        {categorias.map(categoria => (
                            <TarjetaCategoria key={categoria.id} categoria={categoria} />
                        ))}
                    </div>
                </>
            )}
        </main>
    )
}

export default Categorias
