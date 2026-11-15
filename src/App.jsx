import { BrowserRouter as Router } from 'react-router'
import AppRoutes from './routes/AppRoutes'

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <AppRoutes />
    </Router>
  )
}

export default App
