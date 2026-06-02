import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { MenuItem, Category } from '../types'

export function useMenu() {
  const [items, setItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const fetchItems = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('created_at', { ascending: true })
    if (error) {
      setError('Impossible de charger le menu. Vérifiez votre connexion.')
    } else {
      setItems(data ?? [])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchItems()

    const channel = supabase
      .channel('menu_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'menu_items' }, () => {
        fetchItems()
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [fetchItems])

  const filteredItems = items.filter(item => {
    const matchCategory = activeCategory === 'all' || item.category === activeCategory
    const q = searchQuery.toLowerCase()
    const matchSearch = !q ||
      item.name.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.ingredients.some(i => i.toLowerCase().includes(q))
    return matchCategory && matchSearch
  })

  const addItem = useCallback(async (data: Omit<MenuItem, 'id' | 'created_at'>) => {
    const { error } = await supabase.from('menu_items').insert([data])
    if (error) throw new Error(error.message)
  }, [])

  const updateItem = useCallback(async (id: string, data: Partial<MenuItem>) => {
    const { error } = await supabase.from('menu_items').update(data).eq('id', id)
    if (error) throw new Error(error.message)
  }, [])

  const deleteItem = useCallback(async (id: string) => {
    const { error } = await supabase.from('menu_items').delete().eq('id', id)
    if (error) throw new Error(error.message)
  }, [])

  const toggleAvailability = useCallback(async (id: string, current: boolean) => {
    const { error } = await supabase
      .from('menu_items')
      .update({ is_available: !current })
      .eq('id', id)
    if (error) throw new Error(error.message)
  }, [])

  return {
    items,
    filteredItems,
    loading,
    error,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    addItem,
    updateItem,
    deleteItem,
    toggleAvailability,
    refetch: fetchItems,
  }
}
