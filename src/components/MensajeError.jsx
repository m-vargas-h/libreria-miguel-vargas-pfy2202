// Mensaje de error de una petición
function MensajeError({ mensaje, children }) {
    return (
        <div role="alert" className="alerta-error">
            <p className="font-medium">{mensaje}</p>
            {children && <div className="mt-3 flex flex-wrap gap-2">{children}</div>}
        </div>
    )
}

export default MensajeError
