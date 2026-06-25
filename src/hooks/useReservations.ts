import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Reservation, ReservationStatus } from '../types'

export function useReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchReservations = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .order('date', { ascending: true })
      .order('time', { ascending: true })
    if (error) setError(error.message)
    else setReservations(data ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchReservations() }, [])

  const addReservation = async (data: Omit<Reservation, 'id' | 'created_at' | 'status'>) => {
    const { error } = await supabase.from('reservations').insert({ ...data, status: 'pending' })
    if (error) throw new Error(error.message)
  }

  const updateStatus = async (id: string, status: ReservationStatus) => {
    const { error } = await supabase.from('reservations').update({ status }).eq('id', id)
    if (error) throw new Error(error.message)
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status } : r))
  }

  const deleteReservation = async (id: string) => {
    const { error } = await supabase.from('reservations').delete().eq('id', id)
    if (error) throw new Error(error.message)
    setReservations(prev => prev.filter(r => r.id !== id))
  }

  return { reservations, loading, error, addReservation, updateStatus, deleteReservation, refetch: fetchReservations }
}
