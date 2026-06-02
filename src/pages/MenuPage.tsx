import { useState } from 'react'
import { useMenu } from '../hooks/useMenu'
import { useAuth } from '../context/AuthContext'
import { MenuCard } from '../components/MenuCard'
import { MenuItemForm } from '../components/MenuItemForm'
import { LoginModal } from '../components/LoginModal'
import { CATEGORIES } from '../types'
import type { MenuItem } from '../types'

export function MenuPage() {
  const { items, filteredItems, loading, error, activeCategory, setActiveCategory, searchQuery, setSearchQuery, addItem, updateItem, deleteItem, toggleAvailability } = useMenu()
  const { isAdmin, logout } = useAuth()

  const [showLogin, setShowLogin] = useState(false)
  const [showForm, setShowForm] = useState(false)
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

  const grouped = CATEGORIES.filter(c => c.id !== 'all').map(cat => ({
    cat,
    items: filteredItems.filter(i => i.category === cat.id),
  })).filter(g => activeCategory === 'all' ? g.items.length > 0 : g.cat.id === activeCategory)

  return (
    <div className="min-h-screen bg-stone-950">
      {/* Header */}
      <header className="bg-stone-900 border-b border-stone-800 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-amber-400 leading-tight">☀️ Sun El Dorado</h1>
            <p className="text-stone-500 text-xs">Restaurant</p>
          </div>
          <div className="flex items-center gap-3">
            {isAdmin ? (
              <>
                <span className="text-xs text-emerald-400 bg-emerald-900/30 border border-emerald-700/40 rounded-full px-3 py-1">
                  Mode Admin
                </span>
                <button
                  onClick={() => { setEditTarget(null); setShowForm(true) }}
                  className="bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold px-4 py-1.5 rounded-lg transition-colors"
                >
                  + Ajouter
                </button>
                <button
                  onClick={logout}
                  className="text-stone-500 hover:text-stone-300 text-sm transition-colors"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="text-stone-500 hover:text-amber-400 text-xs transition-colors"
              >
                Admin
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-gradient-to-b from-stone-900 to-stone-950 py-10 text-center px-4">
        <h2 className="text-3xl font-bold text-stone-100 mb-2">Notre Carte</h2>
        <p className="text-stone-400">Découvrez nos plats préparés avec passion</p>
        <div className="mt-4 text-xs text-stone-500">
          {items.filter(i => i.is_available).length} plats disponibles
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Search */}
        <div className="relative mb-5">
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Rechercher un plat, un ingrédient..."
            className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-3 pl-10 text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-600"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500">🔍</span>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-sm border transition-all ${activeCategory === cat.id ? `${cat.bgColor} ${cat.color} border-current` : 'bg-stone-900 border-stone-700 text-stone-400 hover:border-stone-500'}`}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading && (
          <div className="text-center py-16 text-stone-500">Chargement du menu...</div>
        )}

        {error && (
          <div className="text-center py-16">
            <p className="text-red-400 mb-2">{error}</p>
            <p className="text-stone-500 text-sm">Vérifiez que Supabase est bien configuré.</p>
          </div>
        )}

        {!loading && !error && filteredItems.length === 0 && (
          <div className="text-center py-16 text-stone-500">Aucun plat trouvé.</div>
        )}

        {!loading && !error && grouped.map(({ cat, items: catItems }) => (
          <section key={cat.id} className="mb-10">
            <div className={`flex items-center gap-2 mb-4 pb-2 border-b border-stone-800`}>
              <span className="text-2xl">{cat.emoji}</span>
              <h3 className={`text-lg font-semibold ${cat.color}`}>{cat.label}</h3>
              <span className="text-stone-600 text-sm ml-auto">{catItems.length} plats</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {catItems.map(item => (
                <MenuCard
                  key={item.id}
                  item={item}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggle={toggleAvailability}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Footer */}
      <footer className="border-t border-stone-800 text-center py-6 text-stone-600 text-sm">
        © 2025 Sun El Dorado · Restaurant
      </footer>

      {/* Modals */}
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
