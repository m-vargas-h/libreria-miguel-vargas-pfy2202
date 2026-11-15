// Funciones de acceso a la API REST de la librería (servida por el mock MSW)
const URL_BASE = '/api'

async function obtener(ruta) {
    const respuesta = await fetch(`${URL_BASE}${ruta}`)
    if (!respuesta.ok) {
        const cuerpo = await respuesta.json().catch(() => null)
        const error = new Error(cuerpo?.mensaje ?? `Error ${respuesta.status} al consultar el servidor`)
        error.status = respuesta.status
        throw error
    }
    return respuesta.json()
}

export const obtenerCategorias = () => obtener('/categorias')
export const obtenerCategoria = (id) => obtener(`/categorias/${id}`)
export const obtenerLibrosPorCategoria = (id) => obtener(`/categorias/${id}/libros`)
export const obtenerLibro = (id) => obtener(`/libros/${id}`)
