import { AuthProvider } from './context/AuthContext'
import { MenuPage } from './pages/MenuPage'

function App() {
  return (
    <AuthProvider>
      <MenuPage />
    </AuthProvider>
  )
}

export default App
