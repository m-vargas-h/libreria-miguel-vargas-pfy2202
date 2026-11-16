// Validaciones del formato de las respuestas de la API.
// Evitan que la interfaz falle si el backend envía datos incompletos o con otra estructura.
const esTexto = (valor) => typeof valor === 'string' && valor.trim() !== ''
const esNumeroPositivo = (valor) => Number.isFinite(valor) && valor >= 0

export const esCategoria = (categoria) =>
    Boolean(categoria) && esTexto(categoria.id) && esTexto(categoria.nombre)

export const esLibro = (libro) =>
    Boolean(libro)
    && Number.isInteger(libro.id)
    && esTexto(libro.titulo)
    && esTexto(libro.autor)
    && esNumeroPositivo(libro.precio)

// El detalle de un libro incluye además su categoría
export const esLibroDetalle = (libro) => esLibro(libro) && esCategoria(libro.categoria)

export const esListaDe = (validar) => (lista) => Array.isArray(lista) && lista.every(validar)
