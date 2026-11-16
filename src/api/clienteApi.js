import { ErrorApi, errorDesdeRespuesta } from './errores'

const URL_BASE = '/api'
// Tiempo máximo de espera de una respuesta (ms)
export const TIEMPO_ESPERA = 5000

// Realiza un GET a la API y traduce cualquier falla a un ErrorApi.
// "signal" permite cancelar la petición cuando ya nadie necesita la respuesta.
export async function pedir(ruta, signal) {
    const senal = AbortSignal.any([signal, AbortSignal.timeout(TIEMPO_ESPERA)])
    let respuesta

    try {
        respuesta = await fetch(`${URL_BASE}${ruta}`, { signal: senal })
    } catch (error) {
        // Cancelación intencional: se propaga tal cual para que se ignore
        if (signal.aborted) throw error
        if (error.name === 'TimeoutError') {
            throw new ErrorApi('tiempoAgotado', `La respuesta superó los ${TIEMPO_ESPERA / 1000} segundos de espera.`)
        }
        throw new ErrorApi('red', 'No se pudo conectar con el servidor.')
    }

    if (!respuesta.ok) {
        const cuerpo = await respuesta.json().catch(() => null)
        throw errorDesdeRespuesta(respuesta.status, cuerpo)
    }

    return respuesta.json()
}
