import { useState } from 'react'
import QRCode from 'react-qr-code'
import { useMenu } from '../hooks/useMenu'
import { useAuth } from '../context/AuthContext'
import { MenuCard } from '../components/MenuCard'
import { MenuItemForm } from '../components/MenuItemForm'
import { LoginModal } from '../components/LoginModal'
import { CATEGORIES } from '../types'
import type { MenuItem } from '../types'

const MENU_URL = 'https://restaurante-sun-el-dorado.vercel.app/'

export function MenuPage() {
  const { items, filteredItems, loading, error, activeCategory, setActiveCategory, searchQuery, setSearchQuery, addItem, updateItem, deleteItem, toggleAvailability } = useMenu()
  const { isAdmin, logout } = useAuth()

  const [showLogin, setShowLogin] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const [editTarget, setEditTarget] = useState<MenuItem | null>(null)

  const handleEdit = (item: MenuItem) => {
    setEditTarget(item)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce plat définitivement ?')) return
    await deleteItem(id)
  }

  const handleSave = async (data: Omit<MenuItem, 'id' | 'created_at'>) => {
    if (editTarget) {
      await updateItem(editTarget.id, data)
    } else {
      await addItem(data)
    }
    setShowForm(false)
    setEditTarget(null)
  }

  const getCategoryCount = (catId: string) =>
    catId === 'all' ? items.length : items.filter(i => i.category === catId).length

  const grouped = CATEGORIES.filter(c => c.id !== 'all').map(cat => ({
    cat,
    items: filteredItems.filter(i => i.category === cat.id),
  })).filter(g => activeCategory === 'all' ? g.items.length > 0 : g.cat.id === activeCategory)

  return (
    <div className="min-h-screen w-full bg-neutral-950">

      {/* Header */}
      <header className="bg-neutral-900 border-b border-neutral-800 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3">

          {/* Logo + titre */}
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-xl sm:text-3xl shadow-lg shadow-amber-900/30">
              ☀️
            </div>
            <div>
              <h1 className="text-base sm:text-xl font-bold text-amber-400 leading-tight">Sun El Dorado</h1>
              <p className="text-neutral-500 text-[10px] sm:text-xs tracking-widest uppercase">Hôtel &amp; Restaurant</p>
            </div>
          </div>

          {/* Citation — masquée sur mobile et tablette */}
          <p className="hidden lg:block text-amber-500/70 text-sm italic text-center flex-1 px-4">
            « Une expérience culinaire d'exception au cœur de l'hôtel »
          </p>

          {/* Bouton admin / déconnexion */}
          {isAdmin ? (
            <button onClick={logout} className="flex-shrink-0 text-neutral-500 hover:text-neutral-300 text-xs sm:text-sm transition-colors border border-neutral-700 px-3 py-1.5 rounded-full">
              Déconnexion
            </button>
          ) : (
            <button
              onClick={() => setShowLogin(true)}
              className="flex-shrink-0 border border-amber-600/50 text-amber-500 hover:border-amber-500 hover:text-amber-400 text-xs sm:text-sm px-3 sm:px-5 py-1.5 rounded-full transition-colors"
            >
              Admin
            </button>
          )}
        </div>
      </header>

      {/* Hero */}
      <div className="relative w-full h-56 sm:h-72 md:h-96 overflow-hidden bg-neutral-950">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(ellipse at 30% 50%, #78350f55 0%, transparent 60%), radial-gradient(ellipse at 70% 40%, #92400e44 0%, transparent 55%)' }} />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <p className="text-amber-400/70 text-xs sm:text-sm uppercase tracking-[0.3em] font-medium mb-3">
            ✦ Hôtel &amp; Restaurant ✦
          </p>
          <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-bold text-white">
            Sun El Dorado
          </h2>
          <p className="text-amber-300/70 text-sm sm:text-base mt-4 italic font-light">
            « Une expérience culinaire d'exception au cœur de l'hôtel »
          </p>
        </div>
      </div>

      {/* Barre tableau de bord Admin */}
      {isAdmin && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-4">
          <div className="bg-[#2a1500] border border-amber-900/50 rounded-2xl px-5 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-900/40 border border-amber-800/50 flex items-center justify-center text-xl flex-shrink-0">
                👨‍🍳
              </div>
              <div>
                <p className="text-amber-400 font-bold text-sm leading-tight">Tableau de bord Chef</p>
                <p className="text-neutral-500 text-xs mt-0.5">Gérez votre carte du restaurant</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <button
                onClick={() => setShowQR(true)}
                className="flex items-center gap-2 border border-neutral-700 text-neutral-300 hover:border-amber-700/60 hover:text-amber-300 text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-xl transition-all"
              >
                <span className="text-base leading-none">⬛</span>
                <span>QR Code</span>
              </button>
              <button
                onClick={() => { setEditTarget(null); setShowForm(true) }}
                className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs sm:text-sm px-3 sm:px-5 py-2 rounded-xl transition-colors"
              >
                <span>+</span>
                <span>Nouveau plat</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-12">

        {/* Tabs catégories — scroll horizontal sur mobile */}
        <div className="flex flex-wrap justify-center gap-2 mb-6 pb-1">
          {CATEGORIES.map(cat => {
            const count = getCategoryCount(cat.id)
            const isActive = activeCategory === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold border transition-all flex-shrink-0 ${
                  isActive
                    ? 'bg-amber-500 border-amber-500 text-neutral-950'
                    : 'bg-neutral-900 border-neutral-700 text-neutral-300 hover:border-neutral-500 hover:text-white'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.id === 'all' ? 'Tout le Menu' : cat.label}</span>
                <span className={`font-bold text-[11px] ${isActive ? 'text-neutral-800' : 'text-neutral-500'}`}>{count}</span>
              </button>
            )
          })}
        </div>

        {/* Barre de recherche */}
        <div className="relative max-w-xl mx-auto mb-8 sm:mb-10">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 text-sm">🔍</span>
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Rechercher un plat, ingrédient..."
            className="w-full bg-neutral-900 border border-neutral-700 rounded-full px-5 py-2.5 sm:py-3 pl-10 text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-amber-600/50 transition-colors text-sm"
          />
        </div>

        {/* Chargement */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <p className="text-neutral-500 mt-3 text-sm">Chargement du menu...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">⚠️</p>
            <p className="text-red-400 font-medium mb-1">{error}</p>
            <p className="text-neutral-500 text-sm">Vérifiez que Supabase est bien configuré.</p>
          </div>
        )}

        {!loading && !error && filteredItems.length === 0 && (
          <div className="text-center py-20">
            <p className="text-4xl mb-3">🍽️</p>
            <p className="text-neutral-400 font-medium">Aucun plat trouvé</p>
            <p className="text-neutral-600 text-sm mt-1">Essayez une autre recherche</p>
          </div>
        )}

        {/* Sections par catégorie */}
        {!loading && !error && grouped.map(({ cat, items: catItems }) => (
          <section key={cat.id} className="mb-16 sm:mb-24">
            <div className="flex items-center justify-center gap-3 mb-1">
              <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-base sm:text-lg flex-shrink-0 ${cat.bgColor}`}>
                {cat.emoji}
              </div>
              <div>
                <h2 className={`font-bold text-base sm:text-lg leading-tight ${cat.color}`}>{cat.label}</h2>
                <p className="text-neutral-600 text-xs">{catItems.length} article{catItems.length > 1 ? 's' : ''}</p>
              </div>
            </div>
            <div className="h-px bg-neutral-800 mt-3 mb-8 sm:mb-10" />
            <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
              {catItems.map(item => (
                <div key={item.id} className="w-full sm:w-[calc(50%-16px)] lg:w-[calc(33.333%-22px)]">
                  <MenuCard
                    item={item}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onToggle={toggleAvailability}
                  />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Pied de page */}
      <footer className="border-t border-neutral-800 py-8 sm:py-10 text-center">
        <p className="text-neutral-300 text-sm font-medium mb-1">
          ☀️ Sun El Dorado — Hôtel &amp; Restaurant
        </p>
        <p className="text-neutral-600 text-xs">Menu digital — Tous droits réservés</p>
      </footer>

      {/* Modale QR Code */}
      {showQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setShowQR(false)}>
          <div className="bg-[#1e1a14] border border-amber-900/40 rounded-2xl p-8 flex flex-col items-center gap-5 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div>
              <h2 className="text-amber-400 font-bold text-lg text-center">QR Code du Menu</h2>
              <p className="text-neutral-500 text-xs text-center mt-1">Scannez pour accéder au menu en ligne</p>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-lg">
              <QRCode value={MENU_URL} size={180} />
            </div>
            <p className="text-neutral-600 text-xs">{MENU_URL}</p>
            <button
              onClick={() => setShowQR(false)}
              className="mt-1 text-neutral-500 hover:text-neutral-300 text-sm transition-colors border border-neutral-700 px-6 py-2 rounded-full"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      {showForm && (
        <MenuItemForm
          initial={editTarget ?? undefined}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditTarget(null) }}
        />
      )}
    </div>
  )
}
