import { useReservations } from '../hooks/useReservations'
import type { ReservationStatus } from '../types'

const STATUS_LABELS: Record<ReservationStatus, { label: string; color: string; bg: string }> = {
  pending:   { label: 'En attente', color: 'text-amber-400',   bg: 'bg-amber-900/30 border-amber-700/50' },
  confirmed: { label: 'Confirmée',  color: 'text-emerald-400', bg: 'bg-emerald-900/30 border-emerald-700/50' },
  cancelled: { label: 'Annulée',    color: 'text-neutral-500', bg: 'bg-neutral-800/50 border-neutral-700/50' },
}

export function ReservationsList() {
  const { reservations, loading, error, updateStatus, deleteReservation } = useReservations()

  if (loading) return (
    <div className="text-center py-10">
      <p className="text-neutral-500 text-sm">Chargement des réservations...</p>
    </div>
  )

  if (error) return (
    <div className="text-center py-10">
      <p className="text-red-400 text-sm">Erreur : {error}</p>
    </div>
  )

  if (reservations.length === 0) return (
    <div className="text-center py-12">
      <p className="text-4xl mb-3">📅</p>
      <p className="text-neutral-400 font-medium">Aucune réservation</p>
    </div>
  )

  return (
    <div className="flex flex-col gap-3">
      {reservations.map(r => {
        const s = STATUS_LABELS[r.status]
        return (
          <div key={r.id} className="bg-[#1e1a14] border border-amber-900/30 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-white font-bold text-sm">{r.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${s.bg} ${s.color}`}>
                  {s.label}
                </span>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-neutral-400">
                <span>📅 {r.date} à {r.time}</span>
                <span>👥 {r.guests} couvert{r.guests > 1 ? 's' : ''}</span>
                <span>✉️ {r.email}</span>
                {r.phone && <span>📞 {r.phone}</span>}
              </div>
              {r.message && (
                <p className="text-neutral-500 text-xs mt-1.5 italic">« {r.message} »</p>
              )}
            </div>
            <div className="flex gap-2 flex-shrink-0">
              {r.status !== 'confirmed' && (
                <button
                  onClick={() => updateStatus(r.id, 'confirmed')}
                  className="text-xs px-3 py-1.5 rounded-lg border border-emerald-700/50 text-emerald-400 hover:bg-emerald-900/20 transition-all"
                >
                  Confirmer
                </button>
              )}
              {r.status !== 'cancelled' && (
                <button
                  onClick={() => updateStatus(r.id, 'cancelled')}
                  className="text-xs px-3 py-1.5 rounded-lg border border-neutral-700 text-neutral-500 hover:text-neutral-400 hover:bg-neutral-800 transition-all"
                >
                  Annuler
                </button>
              )}
              <button
                onClick={() => deleteReservation(r.id)}
                className="text-xs px-3 py-1.5 rounded-lg border border-red-900/50 text-red-500 hover:bg-red-900/20 transition-all"
              >
                🗑
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
