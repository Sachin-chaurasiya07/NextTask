import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Zap, Mail, Lock, ArrowRight } from 'lucide-react'
import { login, clearError } from '../store/authSlice'
import { AppDispatch, RootState } from '../store'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { loading, error, user } = useSelector((s: RootState) => s.auth)

  useEffect(() => {
    if (user) navigate('/dashboard')
    return () => { dispatch(clearError()) }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await dispatch(login(form))
  }

  return (
    <div className="min-h-screen bg-bg-primary flex">
      {/* Left panel - branding */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] bg-bg-secondary border-r border-border p-12">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center shadow-lg shadow-accent/30">
            <Zap size={18} className="text-black" fill="black" />
          </div>
          <span className="font-syne font-bold text-white text-xl">NexTask</span>
        </div>

        <div>
          <h1 className="font-syne font-bold text-white text-4xl leading-tight mb-6">
            Manage work<br />
            Smarter & <span className="text-accent">Faster .</span>
          </h1>
          <p className="text-muted text-lg leading-relaxed">
            A full-stack workSpace built with React, Typescript, Redux, and Node.js.
          </p>

          {/* Feature list */}
          <div className="mt-10 space-y-3">
            {['Drag-and-drop UI', 'Priority & due date tracking', 'Real-time task analytics'].map((f) => (
              <div key={f} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                <span className="text-slate-400 text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-muted text-sm font-mono">built by ME 😁</p>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <Zap size={15} className="text-black" fill="black" />
            </div>
            <span className="font-syne font-bold text-white text-lg">NexTask</span>
          </div>

          <div className="mb-8">
            <h2 className="font-syne font-bold text-white text-3xl mb-2">Welcome back</h2>
            <p className="text-muted">Sign in to your workspace</p>
          </div>

          {error && (
            <div className="mb-5 bg-red-500/10 border border-red-500/25 rounded-xl p-4 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
                  className="input-field pl-11"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
            >
              {loading ? 'Signing in...' : (
                <>Sign in <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-muted text-sm">
            No account yet?{' '}
            <Link to="/register" className="text-accent hover:text-accent-hover font-medium transition-colors">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
