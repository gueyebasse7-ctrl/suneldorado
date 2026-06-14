import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { MenuPage } from './pages/MenuPage'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <MenuPage />
      </CartProvider>
    </AuthProvider>
  )
}

export default App
