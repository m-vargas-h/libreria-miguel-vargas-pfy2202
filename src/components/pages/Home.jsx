import Boton from '../Boton'

function Home() {
    return (
        <main className="contenedor">
            <section className="tarjeta mb-8 bg-marca-50 p-8 text-center">
                <h2 className="mb-3 text-3xl font-bold text-marca-900">Bienvenido a Entre Líneas</h2>
                <p className="mx-auto mb-6 max-w-xl text-gray-700">
                    Explora nuestro catálogo por categorías: ficción, ciencia ficción, fantasía, misterio y más.
                    Encuentra tu próxima lectura y revisa el detalle de cada libro.
                </p>
                <Boton to="/categorias">Explorar categorías</Boton>
            </section>
        </main>
    )
}

export default Home
