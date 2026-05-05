import { Trash2, Calendar, GripVertical, Pencil } from 'lucide-react'
import { Task } from '../types'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../store'
import { deleteTask } from '../store/taskSlice'

interface Props {
  task: Task
  onEdit: (task: Task) => void
}

const priorityConfig = {
  low: { label: 'Low', className: 'bg-slate-500/15 text-slate-400 border-slate-500/25' },
  medium: { label: 'Medium', className: 'bg-amber-500/15 text-amber-400 border-amber-500/25' },
  high: { label: 'High', className: 'bg-red-500/15 text-red-400 border-red-500/25' },
}

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr)
  const now = new Date()
  const isOverdue = d < now
  return {
    label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    isOverdue,
  }
}

export default function TaskCard({ task, onEdit }: Props) {
  const dispatch = useDispatch<AppDispatch>()
  const { label: priorityLabel, className: priorityClass } = priorityConfig[task.priority]

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('Delete this task?')) dispatch(deleteTask(task._id))
  }

  return (
    <div
      className="group bg-bg-card border border-border rounded-xl p-4 cursor-pointer hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5 transition-all duration-200 animate-slide-up"
      onClick={() => onEdit(task)}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <GripVertical size={14} className="text-border shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
          <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2">{task.title}</h3>
        </div>
        <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(task) }}
            className="p-1.5 text-muted hover:text-accent hover:bg-accent/10 rounded-lg transition-all"
          >
            <Pencil size={12} />
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 text-muted hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-muted line-clamp-2 mb-3 leading-relaxed">{task.description}</p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 mt-3">
        <span className={`text-xs font-mono font-medium px-2.5 py-1 rounded-lg border ${priorityClass}`}>
          {priorityLabel}
        </span>
        {task.dueDate && (() => {
          const { label, isOverdue } = formatDate(task.dueDate)
          return (
            <div className={`flex items-center gap-1.5 text-xs ${isOverdue ? 'text-red-400' : 'text-muted'}`}>
              <Calendar size={11} />
              <span>{label}</span>
            </div>
          )
        })()}
      </div>
    </div>
  )
}
