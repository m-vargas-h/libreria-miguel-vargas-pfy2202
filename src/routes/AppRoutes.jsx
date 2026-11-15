import { lazy } from 'react'
import { Routes, Route } from 'react-router'
import Layout from '../components/Layout'

const Home = lazy(() => import('../components/pages/Home'))
const Categorias = lazy(() => import('../components/pages/Categorias'))
const LibrosCategoria = lazy(() => import('../components/pages/LibrosCategoria'))
const DetalleLibro = lazy(() => import('../components/pages/DetalleLibro'))
const NoEncontrada = lazy(() => import('../components/pages/NoEncontrada'))

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="categorias" element={<Categorias />} />
                <Route path="categorias/:categoriaId" element={<LibrosCategoria />} />
                <Route path="libros/:libroId" element={<DetalleLibro />} />
                <Route path="*" element={<NoEncontrada />} />
            </Route>
        </Routes>
    )
}

export default AppRoutes
