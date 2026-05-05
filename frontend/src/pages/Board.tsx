import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { Plus, Circle, Timer, CheckCircle2 } from 'lucide-react'
import Navbar from '../components/Navbar'
import TaskCard from '../components/TaskCard'
import TaskModal from '../components/TaskModal'
import { fetchTasks, updateTask } from '../store/taskSlice'
import { AppDispatch, RootState } from '../store'
import { Task, TaskStatus } from '../types'

const columns: { id: TaskStatus; label: string; icon: React.ReactNode; accent: string; border: string }[] = [
  {
    id: 'todo',
    label: 'Todo',
    icon: <Circle size={14} />,
    accent: 'text-blue-400',
    border: 'border-blue-500/30',
  },
  {
    id: 'in-progress',
    label: 'In Progress',
    icon: <Timer size={14} />,
    accent: 'text-amber-400',
    border: 'border-amber-500/30',
  },
  {
    id: 'done',
    label: 'Done',
    icon: <CheckCircle2 size={14} />,
    accent: 'text-emerald-400',
    border: 'border-emerald-500/30',
  },
]

export default function Board() {
  const dispatch = useDispatch<AppDispatch>()
  const { tasks, loading } = useSelector((s: RootState) => s.tasks)
  const [modalOpen, setModalOpen] = useState(false)
  const [editTask, setEditTask] = useState<Task | null>(null)
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>('todo')

  useEffect(() => { dispatch(fetchTasks()) }, [])

  const getColumnTasks = (status: TaskStatus) =>
    tasks.filter((t) => t.status === status)

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result
    if (!destination) return
    if (destination.droppableId === source.droppableId) return

    dispatch(updateTask({
      id: draggableId,
      updates: { status: destination.droppableId as TaskStatus },
    }))
  }

  const openCreate = (status: TaskStatus) => {
    setEditTask(null)
    setDefaultStatus(status)
    setModalOpen(true)
  }

  const openEdit = (task: Task) => {
    setEditTask(task)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditTask(null)
  }

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col">
      <Navbar />

      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-8 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-syne font-bold text-white text-2xl sm:text-3xl mb-1">Kanban Board</h1>
            <p className="text-muted text-sm">Drag and drop tasks to update their status</p>
          </div>
          <button onClick={() => openCreate('todo')} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> Add Task
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card p-4 h-64 animate-pulse" />
            ))}
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 h-[calc(100vh-220px)]">
              {columns.map(({ id, label, icon, accent, border }) => {
                const colTasks = getColumnTasks(id)
                return (
                  <div key={id} className={`card flex flex-col overflow-hidden border-t-2 ${border}`}>
                    {/* Column header */}
                    <div className="px-4 py-4 border-b border-border flex items-center justify-between shrink-0">
                      <div className={`flex items-center gap-2 font-syne font-semibold text-sm ${accent}`}>
                        {icon}
                        <span>{label}</span>
                        <span className="ml-1 bg-bg-elevated text-muted text-xs font-mono px-2 py-0.5 rounded-full">
                          {colTasks.length}
                        </span>
                      </div>
                      <button
                        onClick={() => openCreate(id)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-muted hover:text-white hover:bg-bg-elevated transition-all"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Droppable area */}
                    <Droppable droppableId={id}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`flex-1 overflow-y-auto p-3 space-y-2.5 transition-colors ${
                            snapshot.isDraggingOver ? 'bg-accent/5' : ''
                          }`}
                        >
                          {colTasks.length === 0 && !snapshot.isDraggingOver && (
                            <div className="h-full flex flex-col items-center justify-center text-muted py-10">
                              <div className="w-12 h-12 rounded-2xl border-2 border-dashed border-border flex items-center justify-center mb-3">
                                <Plus size={18} className="opacity-40" />
                              </div>
                              <p className="text-xs">Drop tasks here or</p>
                              <button
                                onClick={() => openCreate(id)}
                                className="text-xs text-accent hover:text-accent-hover mt-1 transition-colors"
                              >
                                add a new one
                              </button>
                            </div>
                          )}

                          {colTasks.map((task, index) => (
                            <Draggable key={task._id} draggableId={task._id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={{
                                    ...provided.draggableProps.style,
                                    opacity: snapshot.isDragging ? 0.85 : 1,
                                  }}
                                  className={snapshot.isDragging ? 'rotate-1 scale-105 shadow-2xl shadow-accent/10' : ''}
                                >
                                  <TaskCard task={task} onEdit={openEdit} />
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                )
              })}
            </div>
          </DragDropContext>
        )}
      </div>

      <TaskModal
        open={modalOpen}
        onClose={closeModal}
        editTask={editTask}
        defaultStatus={defaultStatus}
      />
    </div>
  )
}
