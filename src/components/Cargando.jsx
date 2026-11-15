// Indicador de carga con mensaje configurable
function Cargando({ mensaje = 'Cargando...' }) {
    return (
        <div role="status" className="flex items-center justify-center gap-3 py-10 text-gray-600">
            <span className="size-5 animate-spin rounded-full border-2 border-marca-300 border-t-marca-700" />
            <span>{mensaje}</span>
        </div>
    )
}

export default Cargando
