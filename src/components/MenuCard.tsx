import { useState } from 'react'
import type { MenuItem } from '../types'
import { CATEGORIES } from '../types'
import { useAuth } from '../context/AuthContext'

interface Props {
  item: MenuItem
  onEdit: (item: MenuItem) => void
  onDelete: (id: string) => void
  onToggle: (id: string, current: boolean) => void
}

export function MenuCard({ item, onEdit, onDelete, onToggle }: Props) {
  const { isAdmin } = useAuth()
  const [showIngredients, setShowIngredients] = useState(false)

  const cat = CATEGORIES.find(c => c.id === item.category)!

  return (
    <div className={`bg-[#1e1a14] border border-amber-900/40 rounded-xl p-4 flex flex-col gap-3 transition-all duration-200 ${
      !item.is_available ? 'opacity-60' : ''
    }`}>

      {/* En-tête : emoji + infos + badge indisponible */}
      <div className="flex gap-3">
        <div className="w-14 h-14 rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center text-2xl flex-shrink-0">
          {item.image_emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-neutral-100 text-base leading-tight">{item.name}</h3>
            {!item.is_available && (
              <span className="text-xs bg-neutral-800 border border-neutral-700 text-neutral-400 px-2.5 py-0.5 rounded-full flex-shrink-0">
                Indisponible
              </span>
            )}
          </div>
          <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full mt-1.5 border ${cat.bgColor} ${cat.color}`}>
            {cat.emoji} {cat.label}
          </span>
          {item.description && (
            <p className="text-neutral-400 text-sm mt-2 leading-relaxed">{item.description}</p>
          )}
        </div>
      </div>

      {/* Allergènes */}
      {item.allergens.length > 0 && (
        <div className="bg-[#2a1a05] border border-amber-800/50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-amber-500 text-sm">⚠️</span>
            <p className="text-amber-500 text-xs font-bold uppercase tracking-wider">Allergènes</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {item.allergens.map(a => (
              <span key={a} className="text-xs border border-amber-700/60 text-amber-400 bg-amber-950/40 rounded-full px-2.5 py-0.5">
                {a}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Composition dépliable */}
      {item.ingredients.length > 0 && (
        <div className="border-t border-amber-900/20 pt-2">
          <button
            onClick={() => setShowIngredients(!showIngredients)}
            className="w-full flex items-center justify-between text-neutral-400 hover:text-neutral-200 text-sm transition-colors py-1"
          >
            <span className="flex items-center gap-2">
              <span className="text-emerald-500 text-sm">✏️</span>
              <span>Composition &amp; Ingrédients ({item.ingredients.length})</span>
            </span>
            <span className={`text-xs transition-transform duration-200 ${showIngredients ? 'rotate-180' : ''}`}>▾</span>
          </button>
          {showIngredients && (
            <p className="text-neutral-400 text-sm mt-2 pl-7 leading-relaxed">
              {item.ingredients.join(', ')}
            </p>
          )}
        </div>
      )}

      {/* Contrôles admin */}
      {isAdmin && (
        <div className="flex gap-2 pt-2 border-t border-amber-900/20">
          <button
            onClick={() => onToggle(item.id, item.is_available)}
            className={`flex-1 text-xs py-2.5 rounded-lg border font-medium transition-all ${
              item.is_available
                ? 'border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300'
                : 'border-emerald-800/50 text-emerald-400 hover:bg-emerald-900/20'
            }`}
          >
            {item.is_available ? 'Désactiver' : 'Activer'}
          </button>
          <button
            onClick={() => onEdit(item)}
            className="flex-1 text-xs py-2.5 rounded-lg border border-amber-700/50 text-amber-400 hover:bg-amber-900/20 font-medium transition-all"
          >
            Modifier
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="flex-1 text-xs py-2.5 rounded-lg border border-neutral-700 text-neutral-500 hover:bg-neutral-800 hover:text-neutral-400 font-medium transition-all"
          >
            Supprimer
          </button>
        </div>
      )}
    </div>
  )
}
