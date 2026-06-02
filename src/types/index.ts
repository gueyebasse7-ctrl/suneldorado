export type Category = 'entrees' | 'plats' | 'desserts' | 'boissons'

export interface MenuItem {
  id: string
  name: string
  description: string
  category: Category
  price: number
  ingredients: string[]
  allergens: string[]
  image_emoji: string
  is_available: boolean
  created_at: string
}

export interface CategoryInfo {
  id: Category | 'all'
  label: string
  emoji: string
  color: string
  bgColor: string
}

export const CATEGORIES: CategoryInfo[] = [
  { id: 'all', label: 'Tout le menu', emoji: '🍴', color: 'text-stone-300', bgColor: 'bg-stone-800/50 border-stone-600/50' },
  { id: 'entrees', label: 'Entrées', emoji: '🥗', color: 'text-emerald-400', bgColor: 'bg-emerald-900/30 border-emerald-700/50' },
  { id: 'plats', label: 'Plats Principaux', emoji: '🍽️', color: 'text-amber-400', bgColor: 'bg-amber-900/30 border-amber-700/50' },
  { id: 'desserts', label: 'Desserts', emoji: '🍰', color: 'text-rose-400', bgColor: 'bg-rose-900/30 border-rose-700/50' },
  { id: 'boissons', label: 'Boissons', emoji: '🥂', color: 'text-sky-400', bgColor: 'bg-sky-900/30 border-sky-700/50' },
]
