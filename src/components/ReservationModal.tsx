import { useState } from 'react'
import type { Reservation } from '../types'

interface Props {
  onClose: () => void
  onSubmit: (data: Omit<Reservation, 'id' | 'created_at' | 'status'>) => Promise<void>
}

const TIME_SLOTS = [
  '12:00', '12:30', '13:00', '13:30', '14:00',
  '19:00', '19:30', '20:00', '20:30', '21:00', '21:30',
]

const today = new Date().toISOString().split('T')[0]

export function ReservationModal({ onClose, onSubmit }: Props) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: 2,
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const set = (field: string, value: string | number) =>
    setForm(f => ({ ...f, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await onSubmit(form)
      setSuccess(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#1a1610] border border-amber-900/40 rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* En-tête */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-neutral-800">
          <div>
            <h2 className="text-amber-400 font-bold text-lg">Réserver une table</h2>
            <p className="text-neutral-500 text-xs mt-0.5">Sun El Dorado — Hôtel &amp; Restaurant</p>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-300 text-xl leading-none transition-colors"
          >
            ✕
          </button>
        </div>

        {success ? (
          <div className="flex flex-col items-center justify-center gap-4 px-6 py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-900/30 border border-emerald-700/50 flex items-center justify-center text-3xl">
              ✅
            </div>
            <div>
              <p className="text-white font-bold text-lg">Réservation envoyée !</p>
              <p className="text-neutral-400 text-sm mt-1">
                Nous vous confirmerons votre table par email sous peu.
              </p>
            </div>
            <button
              onClick={onClose}
              className="mt-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold px-8 py-2.5 rounded-xl transition-colors text-sm"
            >
              Fermer
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">

            {/* Nom */}
            <div>
              <label className="text-neutral-300 text-xs font-semibold uppercase tracking-wider mb-1.5 block">
                Nom complet *
              </label>
              <input
                required
                value={form.name}
                onChange={e => set('name', e.target.value)}
                placeholder="ex. Jean Dupont"
                className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-amber-600/60 transition-colors text-sm"
              />
            </div>

            {/* Email + Téléphone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-neutral-300 text-xs font-semibold uppercase tracking-wider mb-1.5 block">
                  Email *
                </label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                  placeholder="votre@email.com"
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-amber-600/60 transition-colors text-sm"
                />
              </div>
              <div>
                <label className="text-neutral-300 text-xs font-semibold uppercase tracking-wider mb-1.5 block">
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => set('phone', e.target.value)}
                  placeholder="+34 612 345 678"
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-amber-600/60 transition-colors text-sm"
                />
              </div>
            </div>

            {/* Date + Heure */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-neutral-300 text-xs font-semibold uppercase tracking-wider mb-1.5 block">
                  Date *
                </label>
                <input
                  required
                  type="date"
                  min={today}
                  value={form.date}
                  onChange={e => set('date', e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-neutral-200 focus:outline-none focus:border-amber-600/60 transition-colors text-sm"
                />
              </div>
              <div>
                <label className="text-neutral-300 text-xs font-semibold uppercase tracking-wider mb-1.5 block">
                  Heure *
                </label>
                <select
                  required
                  value={form.time}
                  onChange={e => set('time', e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-neutral-200 focus:outline-none focus:border-amber-600/60 transition-colors text-sm"
                >
                  <option value="">Choisir un créneau</option>
                  <optgroup label="Déjeuner">
                    {TIME_SLOTS.slice(0, 5).map(t => <option key={t} value={t}>{t}</option>)}
                  </optgroup>
                  <optgroup label="Dîner">
                    {TIME_SLOTS.slice(5).map(t => <option key={t} value={t}>{t}</option>)}
                  </optgroup>
                </select>
              </div>
            </div>

            {/* Nombre de couverts */}
            <div>
              <label className="text-neutral-300 text-xs font-semibold uppercase tracking-wider mb-2 block">
                Nombre de couverts *
              </label>
              <div className="flex gap-2 flex-wrap">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => set('guests', n)}
                    className={`w-10 h-10 rounded-xl text-sm font-bold border transition-all ${
                      form.guests === n
                        ? 'bg-amber-500 border-amber-500 text-neutral-950'
                        : 'bg-neutral-900 border-neutral-700 text-neutral-300 hover:border-amber-700/60 hover:text-amber-300'
                    }`}
                  >
                    {n}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => set('guests', 10)}
                  className={`px-3 h-10 rounded-xl text-sm font-bold border transition-all ${
                    form.guests > 8
                      ? 'bg-amber-500 border-amber-500 text-neutral-950'
                      : 'bg-neutral-900 border-neutral-700 text-neutral-300 hover:border-amber-700/60 hover:text-amber-300'
                  }`}
                >
                  9+
                </button>
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="text-neutral-300 text-xs font-semibold uppercase tracking-wider mb-1.5 block">
                Message (optionnel)
              </label>
              <textarea
                value={form.message}
                onChange={e => set('message', e.target.value)}
                placeholder="Allergie, occasion spéciale, demande particulière..."
                rows={3}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-amber-600/60 transition-colors text-sm resize-none"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm bg-red-900/20 border border-red-800/50 rounded-xl px-4 py-2.5">
                ⚠️ {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-neutral-950 font-bold py-3 rounded-xl transition-colors text-sm mt-1"
            >
              {submitting ? 'Envoi en cours...' : 'Confirmer la réservation'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
