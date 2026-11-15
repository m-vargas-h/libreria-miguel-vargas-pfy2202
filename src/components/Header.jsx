import { Link, NavLink } from 'react-router'

const ENLACES = [
    { to: '/', texto: 'Inicio', end: true },
    { to: '/categorias', texto: 'Categorías' },
]

function Header() {
    const clasesEnlace = ({ isActive }) =>
        'rounded-md px-3 py-2 text-sm font-medium text-white transition-colors ' +
        (isActive ? 'bg-marca-900' : 'hover:bg-marca-800')

    return (
        <header className="bg-marca-700 shadow-md">
            <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <Link to="/" className="text-xl font-bold text-white">
                    Librería Entre Líneas
                </Link>
                <nav>
                    <ul className="flex flex-wrap gap-2">
                        {ENLACES.map(({ to, texto, end }) => (
                            <li key={to}>
                                <NavLink to={to} end={end} className={clasesEnlace}>{texto}</NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </header>
    )
}

export default Header
