import { useState } from 'react'
import { useCart } from '../context/CartContext'

interface Props {
  open: boolean
  onClose: () => void
}

export function CartDrawer({ open, onClose }: Props) {
  const { cart, removeFromCart, updateQuantity, clearCart, totalPrice, totalItems } = useCart()
  const [ordered, setOrdered] = useState(false)

  const handleOrder = () => {
    setOrdered(true)
    setTimeout(() => {
      clearCart()
      setOrdered(false)
      onClose()
    }, 2500)
  }

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-stone-950 border-l border-stone-800 z-50 flex flex-col shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-800">
          <div className="flex items-center gap-3">
            <span className="text-xl">🛒</span>
            <h2 className="font-bold text-stone-100 text-lg">Mon Panier</h2>
            {totalItems > 0 && (
              <span className="bg-amber-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {totalItems}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-stone-500 hover:text-stone-200 text-2xl leading-none transition-colors"
          >
            ×
          </button>
        </div>

        {/* Confirmation message */}
        {ordered && (
          <div className="mx-5 mt-4 p-4 bg-emerald-900/30 border border-emerald-700/50 rounded-xl text-center">
            <p className="text-3xl mb-2">✅</p>
            <p className="text-emerald-400 font-semibold">Commande envoyée !</p>
            <p className="text-stone-400 text-sm mt-1">Le restaurant a bien reçu votre commande.</p>
          </div>
        )}

        {/* Empty cart */}
        {!ordered && cart.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
            <p className="text-5xl mb-4">🍽️</p>
            <p className="text-stone-300 font-semibold text-lg">Votre panier est vide</p>
            <p className="text-stone-500 text-sm mt-2">Ajoutez des plats depuis le menu pour commencer</p>
          </div>
        )}

        {/* Cart items */}
        {!ordered && cart.length > 0 && (
          <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
            {cart.map(({ item, quantity }) => (
              <div
                key={item.id}
                className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex gap-3"
              >
                <div className="w-11 h-11 rounded-lg bg-stone-800 flex items-center justify-center text-xl flex-shrink-0">
                  {item.image_emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-stone-100 font-medium text-sm leading-tight truncate">{item.name}</p>
                  <p className="text-amber-400 font-bold text-sm mt-0.5">{(item.price * quantity).toFixed(2)} €</p>
                  <p className="text-stone-500 text-xs">{item.price.toFixed(2)} € / unité</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-stone-600 hover:text-red-400 text-xs transition-colors"
                  >
                    ✕
                  </button>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => updateQuantity(item.id, quantity - 1)}
                      className="w-7 h-7 rounded-lg bg-stone-800 border border-stone-700 text-stone-300 hover:bg-stone-700 flex items-center justify-center font-bold transition-all"
                    >
                      −
                    </button>
                    <span className="text-stone-200 font-semibold text-sm w-5 text-center">{quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, quantity + 1)}
                      className="w-7 h-7 rounded-lg bg-stone-800 border border-stone-700 text-stone-300 hover:bg-stone-700 flex items-center justify-center font-bold transition-all"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        {!ordered && cart.length > 0 && (
          <div className="px-5 py-5 border-t border-stone-800 flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="text-stone-400 text-sm">Total</span>
              <span className="text-amber-300 font-bold text-xl">{totalPrice.toFixed(2)} €</span>
            </div>
            <button
              onClick={handleOrder}
              className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-amber-900/30 text-base"
            >
              Confirmer la commande
            </button>
            <button
              onClick={clearCart}
              className="w-full text-stone-500 hover:text-stone-400 text-sm transition-colors py-1"
            >
              Vider le panier
            </button>
          </div>
        )}
      </div>
    </>
  )
}
