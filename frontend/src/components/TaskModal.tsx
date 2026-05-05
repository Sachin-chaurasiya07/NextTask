import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../store'
import { createTask, updateTask } from '../store/taskSlice'
import { Task, TaskFormData, TaskStatus, TaskPriority } from '../types'

interface Props {
  open: boolean
  onClose: () => void
  editTask?: Task | null
  defaultStatus?: TaskStatus
}

const defaultForm: TaskFormData = {
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  dueDate: '',
}

export default function TaskModal({ open, onClose, editTask, defaultStatus }: Props) {
  const dispatch = useDispatch<AppDispatch>()
  const [form, setForm] = useState<TaskFormData>(defaultForm)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (editTask) {
      setForm({
        title: editTask.title,
        description: editTask.description || '',
        status: editTask.status,
        priority: editTask.priority,
        dueDate: editTask.dueDate ? editTask.dueDate.split('T')[0] : '',
      })
    } else {
      setForm({ ...defaultForm, status: defaultStatus || 'todo' })
    }
  }, [editTask, defaultStatus, open])

  if (!open) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const payload = { ...form, dueDate: form.dueDate || undefined }
    if (editTask) {
      await dispatch(updateTask({ id: editTask._id, updates: payload }))
    } else {
      await dispatch(createTask(payload))
    }
    setLoading(false)
    onClose()
  }

  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div>
      <label className="label">{label}</label>
      {children}
    </div>
  )

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-lg card p-6 shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-syne font-bold text-white text-lg">
            {editTask ? 'Edit Task' : 'New Task'}
          </h2>
          <button onClick={onClose} className="text-muted hover:text-white hover:bg-bg-elevated p-2 rounded-xl transition-all">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Title *">
            <input
              className="input-field"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="What needs to be done?"
              required
              autoFocus
            />
          </Field>

          <Field label="Description">
            <textarea
              className="input-field resize-none h-24"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Add more context..."
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Status">
              <select
                className="input-field"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as TaskStatus })}
              >
                <option value="todo">Todo</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </Field>

            <Field label="Priority">
              <select
                className="input-field"
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value as TaskPriority })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </Field>
          </div>

          <Field label="Due Date">
            <input
              type="date"
              className="input-field"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            />
          </Field>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost flex-1 text-center">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? 'Saving...' : editTask ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
