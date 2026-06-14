import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { MenuItem, CartItem } from '../types'

interface CartContextType {
  cart: CartItem[]
  addToCart: (item: MenuItem) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(c => c.item.id === item.id)
      if (existing) {
        return prev.map(c => c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c)
      }
      return [...prev, { item, quantity: 1 }]
    })
  }

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(c => c.item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }
    setCart(prev => prev.map(c => c.item.id === id ? { ...c, quantity } : c))
  }

  const clearCart = () => setCart([])

  const totalItems = cart.reduce((sum, c) => sum + c.quantity, 0)
  const totalPrice = cart.reduce((sum, c) => sum + c.item.price * c.quantity, 0)

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
