import { http, HttpResponse, delay } from 'msw'
import { categorias } from './datos/categorias'
import { libros } from './datos/libros'
import { obtenerEscenario } from './escenario'

// Retraso simulado del servidor (ms) para poder ver los indicadores de carga
const RETRASO = 800
// Retraso del escenario "lento": supera el tiempo de espera del cliente
const RETRASO_LENTO = 8000

const noEncontrado = (mensaje) => HttpResponse.json({ mensaje }, { status: 404 })

// Envuelve cada handler para aplicar el escenario elegido en el simulador
const conEscenario = (resolver) => async (info) => {
    const escenario = obtenerEscenario()

    if (escenario === 'sinConexion') return HttpResponse.error()

    await delay(escenario === 'lento' ? RETRASO_LENTO : RETRASO)

    if (escenario === 'error500') {
        return HttpResponse.json({ mensaje: 'Error interno del servidor' }, { status: 500 })
    }
    return resolver(info)
}

export const handlers = [
    // GET /api/categorias -> lista de categorías con la cantidad de libros de cada una
    http.get('/api/categorias', conEscenario(() => {
        const respuesta = categorias.map(categoria => ({
            ...categoria,
            cantidadLibros: libros.filter(libro => libro.categoriaId === categoria.id).length,
        }))
        return HttpResponse.json(respuesta)
    })),

    // GET /api/categorias/:id -> una categoría
    http.get('/api/categorias/:id', conEscenario(({ params }) => {
        const categoria = categorias.find(c => c.id === params.id)
        if (!categoria) return noEncontrado(`La categoría "${params.id}" no existe`)
        return HttpResponse.json(categoria)
    })),

    // GET /api/categorias/:id/libros -> libros de una categoría
    http.get('/api/categorias/:id/libros', conEscenario(({ params }) => {
        if (!categorias.some(c => c.id === params.id)) {
            return noEncontrado(`La categoría "${params.id}" no existe`)
        }
        return HttpResponse.json(libros.filter(libro => libro.categoriaId === params.id))
    })),

    // GET /api/libros/:id -> detalle de un libro con su categoría
    http.get('/api/libros/:id', conEscenario(({ params }) => {
        const libro = libros.find(l => l.id === Number(params.id))
        if (!libro) return noEncontrado(`El libro con id ${params.id} no existe`)

        const categoria = categorias.find(c => c.id === libro.categoriaId)
        return HttpResponse.json({ ...libro, categoria: { id: categoria.id, nombre: categoria.nombre } })
    })),
]
