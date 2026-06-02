import { useState } from 'react'
import type { MenuItem, Category } from '../types'
import { CATEGORIES } from '../types'

type FormData = Omit<MenuItem, 'id' | 'created_at'>

interface Props {
  initial?: MenuItem
  onSave: (data: FormData) => Promise<void>
  onCancel: () => void
}

const EMOJIS = ['🥗','🍲','🥩','🍗','🐟','🍝','🍛','🫕','🥘','🍰','🎂','🍮','🍫','🍹','🥂','💧','☕','🍷']

export function MenuItemForm({ initial, onSave, onCancel }: Props) {
  const [name, setName] = useState(initial?.name ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [category, setCategory] = useState<Category>(initial?.category ?? 'plats')
  const [price, setPrice] = useState(initial?.price?.toString() ?? '')
  const [imageEmoji, setImageEmoji] = useState(initial?.image_emoji ?? '🍽️')
  const [ingredients, setIngredients] = useState(initial?.ingredients?.join(', ') ?? '')
  const [allergens, setAllergens] = useState(initial?.allergens?.join(', ') ?? '')
  const [isAvailable, setIsAvailable] = useState(initial?.is_available ?? true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !price) {
      setError('Le nom et le prix sont obligatoires.')
      return
    }
    setSaving(true)
    setError('')
    try {
      await onSave({
        name: name.trim(),
        description: description.trim(),
        category,
        price: parseFloat(price),
        image_emoji: imageEmoji,
        ingredients: ingredients.split(',').map(s => s.trim()).filter(Boolean),
        allergens: allergens.split(',').map(s => s.trim()).filter(Boolean),
        is_available: isAvailable,
      })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde')
      setSaving(false)
    }
  }

  const cats = CATEGORIES.filter(c => c.id !== 'all') as { id: Category; label: string }[]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-stone-900 border border-amber-800/30 rounded-2xl p-6 w-full max-w-lg shadow-2xl my-4">
        <h2 className="text-lg font-bold text-amber-300 mb-5">
          {initial ? 'Modifier le plat' : 'Ajouter un plat'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs text-stone-400 mb-1 uppercase tracking-wider">Nom *</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-200 focus:outline-none focus:border-amber-600"
                placeholder="Ex: Filet de Bœuf"
              />
            </div>

            <div>
              <label className="block text-xs text-stone-400 mb-1 uppercase tracking-wider">Catégorie</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as Category)}
                className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-200 focus:outline-none focus:border-amber-600"
              >
                {cats.map(c => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-stone-400 mb-1 uppercase tracking-wider">Prix (€) *</label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={price}
                onChange={e => setPrice(e.target.value)}
                className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-200 focus:outline-none focus:border-amber-600"
                placeholder="Ex: 18.50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-stone-400 mb-1 uppercase tracking-wider">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={2}
              className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-200 focus:outline-none focus:border-amber-600 resize-none"
              placeholder="Description courte du plat"
            />
          </div>

          <div>
            <label className="block text-xs text-stone-400 mb-1 uppercase tracking-wider">Ingrédients (séparés par des virgules)</label>
            <input
              value={ingredients}
              onChange={e => setIngredients(e.target.value)}
              className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-200 focus:outline-none focus:border-amber-600"
              placeholder="Bœuf, pommes de terre, thym..."
            />
          </div>

          <div>
            <label className="block text-xs text-stone-400 mb-1 uppercase tracking-wider">Allergènes (séparés par des virgules)</label>
            <input
              value={allergens}
              onChange={e => setAllergens(e.target.value)}
              className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-200 focus:outline-none focus:border-amber-600"
              placeholder="Gluten, Lait..."
            />
          </div>

          <div>
            <label className="block text-xs text-stone-400 mb-2 uppercase tracking-wider">Emoji</label>
            <div className="flex flex-wrap gap-2">
              {EMOJIS.map(e => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setImageEmoji(e)}
                  className={`w-9 h-9 rounded-lg text-xl flex items-center justify-center transition-colors ${imageEmoji === e ? 'bg-amber-600 ring-2 ring-amber-400' : 'bg-stone-800 hover:bg-stone-700'}`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsAvailable(!isAvailable)}
              className={`relative w-12 h-6 rounded-full transition-colors ${isAvailable ? 'bg-emerald-600' : 'bg-stone-600'}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${isAvailable ? 'left-6' : 'left-0.5'}`} />
            </button>
            <span className="text-stone-300 text-sm">{isAvailable ? 'Disponible' : 'Indisponible'}</span>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-2.5 rounded-lg border border-stone-700 text-stone-400 hover:bg-stone-800 transition-colors"
              disabled={saving}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold transition-colors disabled:opacity-50"
            >
              {saving ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
