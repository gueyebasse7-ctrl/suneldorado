import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

interface Props {
  onClose: () => void
}

export function LoginModal({ onClose }: Props) {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErr('')
    const ok = await login(email, pass)
    if (ok) {
      onClose()
    } else {
      setErr('Email ou mot de passe incorrect')
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-stone-900 border border-amber-800/30 rounded-2xl p-8 w-full max-w-sm shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center mb-4">
            <span className="text-2xl">🔐</span>
          </div>
          <h2 className="text-xl font-bold text-amber-300">Espace Administrateur</h2>
          <p className="text-stone-500 text-sm mt-1">Connexion Chef / Gestionnaire</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-stone-400 mb-1.5 uppercase tracking-wider">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setErr('') }}
              className="w-full bg-stone-800 border border-stone-700 rounded-lg px-4 py-2.5 text-stone-200 focus:outline-none focus:border-amber-600"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-xs text-stone-400 mb-1.5 uppercase tracking-wider">
              Mot de passe
            </label>
            <input
              type="password"
              value={pass}
              onChange={e => { setPass(e.target.value); setErr('') }}
              className="w-full bg-stone-800 border border-stone-700 rounded-lg px-4 py-2.5 text-stone-200 focus:outline-none focus:border-amber-600"
            />
          </div>
          {err && <p className="text-red-400 text-sm text-center">{err}</p>}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-stone-700 text-stone-400 hover:bg-stone-800 transition-colors"
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold transition-colors disabled:opacity-50"
            >
              {loading ? 'Connexion...' : 'Connexion'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
