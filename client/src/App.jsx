import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { request } from './api'
import { emptyForm } from './constants'
import NewTaskForm from './components/NewTaskForm'
import Notification from './components/Notification'
import Sidebar from './components/Sidebar'
import StatsGrid from './components/StatsGrid'
import TaskList from './components/TaskList'
import TaskDetailsModal from './components/TaskDetailsModal'

function App() {
  const [tasks, setTasks] = useState([])
  const [allTasks, setAllTasks] = useState([])
  const [filter, setFilter] = useState('All tasks')
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [actionId, setActionId] = useState('')
  const [error, setError] = useState('')
  const [formError, setFormError] = useState('')
  const [notification, setNotification] = useState(null)
  const [selectedTask, setSelectedTask] = useState(null)

  const loadTasks = async (status = filter, showMessage = true) => {
    setLoading(true)
    setError('')
    try {
      const query = status === 'All tasks' ? '' : `?status=${encodeURIComponent(status)}`
      const result = await request(`/tasks${query}`)
      setTasks(result.tasks)
      if (status === 'All tasks') setAllTasks(result.tasks)
      if (showMessage) setNotification({ type: 'success', message: result.message })
    } catch (loadError) {
      setError(loadError.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let active = true
    const initialLoad = async () => {
      try {
        const result = await request('/tasks')
        if (active) {
          setTasks(result.tasks)
          setAllTasks(result.tasks)
          setNotification({ type: 'success', message: result.message })
        }
      } catch (loadError) {
        if (active) setError(loadError.message)
      } finally {
        if (active) setLoading(false)
      }
    }
    initialLoad()
    return () => { active = false }
  }, [])

  useEffect(() => {
    if (!notification) return undefined
    const timeoutId = window.setTimeout(() => setNotification(null), 4000)
    return () => window.clearTimeout(timeoutId)
  }, [notification])

  const counts = useMemo(() => ({
    total: allTasks.length,
    todo: allTasks.filter((task) => task.status === 'To Do').length,
    active: allTasks.filter((task) => task.status === 'In Progress').length,
    done: allTasks.filter((task) => task.status === 'Done').length,
  }), [allTasks])

  const handleFilter = async (value) => {
    const nextFilter = value === 'All tasks' ? 'All tasks' : value
    setFilter(nextFilter)
    await loadTasks(nextFilter, false)
    setNotification({ type: 'success', message: nextFilter === 'All tasks' ? 'Showing all tasks.' : `Showing ${nextFilter.toLowerCase()} tasks.` })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFormError('')
    if (!form.title.trim()) {
      setFormError('A title is required.')
      return
    }
    if (form.title.trim().length > 100) {
      setFormError('Keep the title to 100 characters or fewer.')
      return
    }

    setSaving(true)
    try {
      const result = await request('/tasks', {
        method: 'POST',
        body: JSON.stringify({ ...form, title: form.title.trim() }),
      })
      setForm(emptyForm)
      await loadTasks(filter, false)
      if (filter !== 'All tasks') {
        const allTasksResult = await request('/tasks')
        setAllTasks(allTasksResult.tasks)
      }
      setNotification({ type: 'success', message: result.message })
    } catch (saveError) {
      setFormError(saveError.message)
    } finally {
      setSaving(false)
    }

  }

  const updateStatus = async (taskId, status) => {
    setActionId(taskId)
    setError('')
    try {
      const result = await request(`/tasks/${taskId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      })
      setAllTasks((current) => current.map((task) => task._id === result.task._id ? result.task : task))
      await loadTasks(filter, false)
      setNotification({ type: 'success', message: result.message })
    } catch (updateError) {
      setError(updateError.message)
    } finally {
      setActionId('')
    }
  }

  const deleteTask = async (task) => {
    if (!window.confirm(`Delete "${task.title}"? This cannot be undone.`)) return
    setActionId(task._id)
    setError('')
    try {
      const result = await request(`/tasks/${task._id}`, { method: 'DELETE' })
      setAllTasks((current) => current.filter((item) => item._id !== task._id))
      await loadTasks(filter, false)
      setNotification({ type: 'success', message: result?.message || 'Task deleted successfully.' })
    } catch (deleteError) {
      setError(deleteError.message)
    } finally {
      setActionId('')
    }
  }

  return (
    <div className="app-shell">
      <Sidebar completed={counts.done} total={counts.total} />
      <main className="main-content">
        <Notification notification={notification} onDismiss={() => setNotification(null)} />
        <StatsGrid total={counts.total} todo={counts.todo} active={counts.active} completed={counts.done} onFilter={handleFilter} selectedFilter={filter} />
        <section className="workspace-grid">
          <TaskList
            actionId={actionId}
            error={error}
            filter={filter}
            loading={loading}
            onDelete={deleteTask}
            onFilter={handleFilter}
            onRetry={() => loadTasks()}
            onStatusChange={updateStatus}
            onSelect={setSelectedTask}
            tasks={tasks}
          />
          <NewTaskForm form={form} formError={formError} onChange={setForm} onSubmit={handleSubmit} saving={saving} />
        </section>
      </main>
      <TaskDetailsModal task={selectedTask} onClose={() => setSelectedTask(null)} />
    </div>
  )
}

export default App
