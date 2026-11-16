import SimuladorBackend from './SimuladorBackend'

function Footer() {
    return (
        <footer className="mt-auto bg-gray-800 py-4 text-sm text-gray-300">
            <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 text-center">
                <SimuladorBackend />
                <p>Librería Entre Líneas · Datos servidos por una API REST mock (MSW)</p>
            </div>
        </footer>
    )
}

export default Footer
