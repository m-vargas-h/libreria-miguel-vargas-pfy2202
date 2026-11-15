import { http, HttpResponse, delay } from 'msw'
import { categorias } from './datos/categorias'
import { libros } from './datos/libros'

// Retraso simulado del servidor (ms) para poder ver los indicadores de carga
const RETRASO = 800

const noEncontrado = (mensaje) => HttpResponse.json({ mensaje }, { status: 404 })

export const handlers = [
    // GET /api/categorias -> lista de categorías con la cantidad de libros de cada una
    http.get('/api/categorias', async () => {
        await delay(RETRASO)
        const respuesta = categorias.map(categoria => ({
            ...categoria,
            cantidadLibros: libros.filter(libro => libro.categoriaId === categoria.id).length,
        }))
        return HttpResponse.json(respuesta)
    }),

    // GET /api/categorias/:id -> una categoría
    http.get('/api/categorias/:id', async ({ params }) => {
        await delay(RETRASO)
        const categoria = categorias.find(c => c.id === params.id)
        if (!categoria) return noEncontrado(`La categoría "${params.id}" no existe`)
        return HttpResponse.json(categoria)
    }),

    // GET /api/categorias/:id/libros -> libros de una categoría
    http.get('/api/categorias/:id/libros', async ({ params }) => {
        await delay(RETRASO)
        if (!categorias.some(c => c.id === params.id)) {
            return noEncontrado(`La categoría "${params.id}" no existe`)
        }
        return HttpResponse.json(libros.filter(libro => libro.categoriaId === params.id))
    }),

    // GET /api/libros/:id -> detalle de un libro con su categoría
    http.get('/api/libros/:id', async ({ params }) => {
        await delay(RETRASO)
        const libro = libros.find(l => l.id === Number(params.id))
        if (!libro) return noEncontrado(`El libro con id ${params.id} no existe`)

        const categoria = categorias.find(c => c.id === libro.categoriaId)
        return HttpResponse.json({ ...libro, categoria: { id: categoria.id, nombre: categoria.nombre } })
    }),
]
