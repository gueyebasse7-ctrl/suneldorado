import type { MenuItem } from '../types'
import { useAuth } from '../context/AuthContext'

interface Props {
  item: MenuItem
  onEdit: (item: MenuItem) => void
  onDelete: (id: string) => void
  onToggle: (id: string, current: boolean) => void
}

export function MenuCard({ item, onEdit, onDelete, onToggle }: Props) {
  const { isAdmin } = useAuth()

  return (
    <div className={`bg-stone-900 border rounded-2xl p-5 flex flex-col gap-3 transition-all ${item.is_available ? 'border-stone-700/50' : 'border-stone-800/50 opacity-60'}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{item.image_emoji}</span>
          <div>
            <h3 className="font-semibold text-stone-100 leading-tight">{item.name}</h3>
            {!item.is_available && (
              <span className="text-xs text-red-400 font-medium">Indisponible</span>
            )}
          </div>
        </div>
        <span className="text-amber-400 font-bold text-lg whitespace-nowrap">{item.price.toFixed(2)} €</span>
      </div>

      <p className="text-stone-400 text-sm leading-relaxed">{item.description}</p>

      {item.ingredients.length > 0 && (
        <div>
          <p className="text-xs text-stone-500 uppercase tracking-wider mb-1">Ingrédients</p>
          <p className="text-stone-400 text-sm">{item.ingredients.join(' · ')}</p>
        </div>
      )}

      {item.allergens.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {item.allergens.map(a => (
            <span key={a} className="text-xs bg-amber-900/30 border border-amber-700/40 text-amber-400 rounded-full px-2.5 py-0.5">
              ⚠️ {a}
            </span>
          ))}
        </div>
      )}

      {isAdmin && (
        <div className="flex gap-2 pt-1 border-t border-stone-800 mt-1">
          <button
            onClick={() => onToggle(item.id, item.is_available)}
            className={`flex-1 text-xs py-1.5 rounded-lg border transition-colors ${item.is_available ? 'border-red-800/50 text-red-400 hover:bg-red-900/20' : 'border-emerald-800/50 text-emerald-400 hover:bg-emerald-900/20'}`}
          >
            {item.is_available ? 'Désactiver' : 'Activer'}
          </button>
          <button
            onClick={() => onEdit(item)}
            className="flex-1 text-xs py-1.5 rounded-lg border border-amber-800/50 text-amber-400 hover:bg-amber-900/20 transition-colors"
          >
            Modifier
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="flex-1 text-xs py-1.5 rounded-lg border border-stone-700 text-stone-500 hover:bg-stone-800 transition-colors"
          >
            Supprimer
          </button>
        </div>
      )}
    </div>
  )
}
