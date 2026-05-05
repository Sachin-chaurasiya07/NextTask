import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  CheckCircle2, Clock, ListTodo, LayoutGrid,
  Plus, TrendingUp, AlertTriangle, ArrowRight
} from 'lucide-react'
import Navbar from '../components/Navbar'
import TaskModal from '../components/TaskModal'
import { fetchTasks } from '../store/taskSlice'
import { AppDispatch, RootState } from '../store'
import { Task } from '../types'

const priorityColor: Record<string, string> = {
  low: 'bg-slate-500',
  medium: 'bg-amber-500',
  high: 'bg-red-500',
}

const statusColor: Record<string, string> = {
  todo: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  'in-progress': 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  done: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
}

const statusLabel: Record<string, string> = {
  todo: 'Todo',
  'in-progress': 'In Progress',
  done: 'Done',
}

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>()
  const { tasks, loading } = useSelector((s: RootState) => s.tasks)
  const { user } = useSelector((s: RootState) => s.auth)
  const [modalOpen, setModalOpen] = useState(false)
  const [editTask, setEditTask] = useState<Task | null>(null)

  useEffect(() => { dispatch(fetchTasks()) }, [])

  const todo = tasks.filter((t) => t.status === 'todo').length
  const inProgress = tasks.filter((t) => t.status === 'in-progress').length
  const done = tasks.filter((t) => t.status === 'done').length
  const high = tasks.filter((t) => t.priority === 'high').length
  const total = tasks.length
  const completionRate = total ? Math.round((done / total) * 100) : 0

  const stats = [
    { label: 'Total Tasks', value: total, icon: ListTodo, color: 'text-slate-400', bg: 'bg-slate-500/10 border-slate-500/20' },
    { label: 'In Progress', value: inProgress, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
    { label: 'Completed', value: done, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    { label: 'High Priority', value: high, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
  ]

  const recent = [...tasks].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 6)

  const openEdit = (task: Task) => { setEditTask(task); setModalOpen(true) }
  const closeModal = () => { setModalOpen(false); setEditTask(null) }

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="font-syne font-bold text-white text-2xl sm:text-3xl mb-1">
              Hey, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p className="text-muted">Here's what's happening with your work today.</p>
          </div>
          <button onClick={() => setModalOpen(true)} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> New Task
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className={`card p-5 border ${bg}`}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-slate-400 text-sm font-medium">{label}</span>
                <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center`}>
                  <Icon size={16} className={color} />
                </div>
              </div>
              <p className={`font-syne font-bold text-3xl ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Tasks */}
          <div className="lg:col-span-2 card p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-syne font-semibold text-white text-lg">Recent Tasks</h2>
              <Link to="/board" className="text-accent hover:text-accent-hover text-sm flex items-center gap-1 transition-colors">
                View all <ArrowRight size={14} />
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-14 bg-bg-elevated rounded-xl animate-pulse" />
                ))}
              </div>
            ) : recent.length === 0 ? (
              <div className="text-center py-12">
                <LayoutGrid size={32} className="text-border mx-auto mb-3" />
                <p className="text-muted text-sm">No tasks yet. Create your first one!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {recent.map((task) => (
                  <div
                    key={task._id}
                    onClick={() => openEdit(task)}
                    className="flex items-center gap-4 p-3.5 rounded-xl hover:bg-bg-elevated cursor-pointer transition-colors group"
                  >
                    <div className={`w-2 h-2 rounded-full ${priorityColor[task.priority]} shrink-0`} />
                    <p className="text-sm text-white flex-1 line-clamp-1 font-medium">{task.title}</p>
                    <span className={`text-xs font-mono px-2.5 py-1 rounded-lg border ${statusColor[task.status]} shrink-0`}>
                      {statusLabel[task.status]}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Progress Panel */}
          <div className="card p-6">
            <h2 className="font-syne font-semibold text-white text-lg mb-5">Progress</h2>

            {/* Completion rate */}
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted">Completion rate</span>
                <span className="text-accent font-mono font-semibold">{completionRate}%</span>
              </div>
              <div className="h-2 bg-bg-elevated rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full transition-all duration-700"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>

            {/* Status breakdown */}
            <div className="space-y-3">
              {[
                { label: 'Todo', count: todo, color: 'bg-blue-500' },
                { label: 'In Progress', count: inProgress, color: 'bg-amber-500' },
                { label: 'Done', count: done, color: 'bg-emerald-500' },
              ].map(({ label, count, color }) => (
                <div key={label}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-muted">{label}</span>
                    <span className="text-slate-300 font-mono">{count}</span>
                  </div>
                  <div className="h-1.5 bg-bg-elevated rounded-full overflow-hidden">
                    <div
                      className={`h-full ${color} rounded-full transition-all duration-700`}
                      style={{ width: total ? `${(count / total) * 100}%` : '0%' }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-5 border-t border-border">
              <div className="flex items-center gap-2 text-sm text-muted">
                <TrendingUp size={14} className="text-accent" />
                <span>{total} task{total !== 1 ? 's' : ''} total</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TaskModal open={modalOpen} onClose={closeModal} editTask={editTask} />
    </div>
  )
}
