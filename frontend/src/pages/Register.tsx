import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Zap, User, Mail, Lock, ArrowRight } from 'lucide-react'
import { register, clearError } from '../store/authSlice'
import { AppDispatch, RootState } from '../store'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { loading, error, user } = useSelector((s: RootState) => s.auth)

  useEffect(() => {
    if (user) navigate('/dashboard')
    return () => { dispatch(clearError()) }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await dispatch(register(form))
  }

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2.5 mb-10">
          <div className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center shadow-lg shadow-accent/30">
            <Zap size={17} className="text-black" fill="black" />
          </div>
          <span className="font-syne font-bold text-white text-xl">NexTask</span>
        </div>

        <div className="mb-8">
          <h2 className="font-syne font-bold text-white text-3xl mb-2">Create your account</h2>
          <p className="text-muted">Start managing work in minutes</p>
        </div>

        {error && (
          <div className="mb-5 bg-red-500/10 border border-red-500/25 rounded-xl p-4 text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Full name</label>
            <div className="relative">
              <User size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="input-field pl-11"
                placeholder="Sachin Chaurasiya"
              />
            </div>
          </div>

          <div>
            <label className="label">Email address</label>
            <div className="relative">
              <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="input-field pl-11"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="label">Password</label>
            <div className="relative">
              <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                minLength={6}
                className="input-field pl-11"
                placeholder="Min 6 characters"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
          >
            {loading ? 'Creating account...' : (
              <>Get started <ArrowRight size={16} /></>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-muted text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-accent hover:text-accent-hover font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
