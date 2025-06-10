"use client"

import { useCallback, useEffect, useState } from 'react'

const statusOptions = ['pending', 'in_progress', 'completed', 'canceled']
const priorityOptions = ['low', 'medium', 'high', 'urgent']

export default function TasksPage() {
  const [tasks, setTasks] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    q: '',
    tags: '',
    page: 1,
    pageSize: 10,
  })
  const [editingTask, setEditingTask] = useState(null)
  const [form, setForm] = useState({})

  // Fetch task list with filters
  const fetchTasks = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([k, v]) => {
      if (v) params.append(k, v)
    })
    const res = await fetch(`/api/tasks?${params.toString()}`)
    const data = await res.json()
    setTasks(data.tasks)
    setTotal(data.total)
    setLoading(false)
  }, [filters])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  // Create or edit task
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title) return alert('Title is required')
    const method = editingTask ? 'PUT' : 'POST'
    const body = editingTask
      ? { ...editingTask, ...form }
      : form
    const res = await fetch('/api/tasks', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (res.ok) {
      setForm({})
      setEditingTask(null)
      fetchTasks()
    } else {
      alert('Error saving task')
    }
  }

  // Delete task
  const handleDelete = async (id) => {
    if (!confirm('Delete this task?')) return
    const res = await fetch('/api/tasks', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    if (res.ok) fetchTasks()
    else alert('Error deleting task')
  }

  // Edit task
  const handleEdit = (task) => {
    setEditingTask(task)
    setForm({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      progress: task.progress,
      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
      tags: task.tags ? task.tags.join(',') : '',
      note: task.note || '',
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Pagination
  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }))
  }

  // Handle filter change
  const handleFiltersChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value, page: 1 }))
  }

  // Reset form
  const handleResetForm = () => {
    setForm({})
    setEditingTask(null)
  }

  return (
    <div className="max-w-4xl mx-auto px-2 py-8">
      <h1 className="text-3xl font-bold mb-6">Task Manager</h1>

      {/* Filter */}
      <div className="mb-8 p-4 rounded bg-gray-100 border flex flex-wrap gap-4">
        <input
          name="q"
          value={filters.q}
          onChange={handleFiltersChange}
          placeholder="Search..."
          className="px-2 py-1 rounded border"
        />
        <select name="status" value={filters.status} onChange={handleFiltersChange} className="px-2 py-1 rounded border">
          <option value="">All status</option>
          {statusOptions.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select name="priority" value={filters.priority} onChange={handleFiltersChange} className="px-2 py-1 rounded border">
          <option value="">All priority</option>
          {priorityOptions.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <input
          name="tags"
          value={filters.tags}
          onChange={handleFiltersChange}
          placeholder="Tags (comma separated)"
          className="px-2 py-1 rounded border"
        />
        <button className="ml-auto px-3 py-1 text-sm rounded bg-blue-600 text-white" onClick={fetchTasks} type="button">
          Filter
        </button>
      </div>

      {/* Task Form */}
      <form onSubmit={handleSubmit} className="mb-8 p-4 bg-white rounded border shadow flex flex-col gap-2">
        <h2 className="text-xl font-semibold mb-2">{editingTask ? 'Edit Task' : 'New Task'}</h2>
        <div className="flex flex-col md:flex-row gap-2">
          <input
            name="title"
            value={form.title || ''}
            onChange={handleChange}
            placeholder="Title"
            required
            className="flex-1 px-2 py-1 rounded border"
          />
          <select name="status" value={form.status || 'pending'} onChange={handleChange} className="px-2 py-1 rounded border">
            {statusOptions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select name="priority" value={form.priority || 'medium'} onChange={handleChange} className="px-2 py-1 rounded border">
            {priorityOptions.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
        <textarea
          name="description"
          value={form.description || ''}
          onChange={handleChange}
          placeholder="Description"
          className="px-2 py-1 rounded border"
        />
        <input
          name="progress"
          type="number"
          min={0}
          max={100}
          value={form.progress || 0}
          onChange={handleChange}
          placeholder="Progress (%)"
          className="px-2 py-1 rounded border"
        />
        <input
          name="dueDate"
          type="date"
          value={form.dueDate || ''}
          onChange={handleChange}
          className="px-2 py-1 rounded border"
        />
        <input
          name="tags"
          value={form.tags || ''}
          onChange={handleChange}
          placeholder="Tags (comma separated)"
          className="px-2 py-1 rounded border"
        />
        <input
          name="note"
          value={form.note || ''}
          onChange={handleChange}
          placeholder="Note"
          className="px-2 py-1 rounded border"
        />
        <div className="flex gap-2 mt-2">
          <button type="submit" className="px-4 py-2 rounded bg-green-600 text-white">
            {editingTask ? 'Update' : 'Create'}
          </button>
          {editingTask && (
            <button type="button" className="px-4 py-2 rounded bg-gray-400 text-white" onClick={handleResetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Task List */}
      <div className="bg-white rounded shadow border overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 text-left">Title</th>
              <th className="p-2">Status</th>
              <th className="p-2">Priority</th>
              <th className="p-2">Progress</th>
              <th className="p-2">Tags</th>
              <th className="p-2">Due</th>
              <th className="p-2">Note</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center py-8">Loading...</td>
              </tr>
            ) : tasks.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-8">No tasks found</td>
              </tr>
            ) : (
              tasks.map((task) => (
                <tr key={task.id} className="border-t">
                  <td className="p-2 font-medium">{task.title}</td>
                  <td className="p-2">{task.status}</td>
                  <td className="p-2">{task.priority}</td>
                  <td className="p-2">{task.progress}%</td>
                  <td className="p-2">{task.tags && task.tags.join(', ')}</td>
                  <td className="p-2">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : ''}</td>
                  <td className="p-2">{task.note}</td>
                  <td className="p-2 flex gap-2">
                    <button className="px-2 py-1 rounded bg-yellow-500 text-white" onClick={() => handleEdit(task)}>
                      Edit
                    </button>
                    <button className="px-2 py-1 rounded bg-red-600 text-white" onClick={() => handleDelete(task.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="flex gap-2 mt-4 justify-end items-center">
        <span>
          Page {filters.page} / {Math.ceil(total / filters.pageSize)}
        </span>
        <button
          disabled={filters.page <= 1}
          className="px-2 py-1 rounded bg-gray-300"
          onClick={() => handlePageChange(filters.page - 1)}
        >Prev</button>
        <button
          disabled={filters.page >= Math.ceil(total / filters.pageSize)}
          className="px-2 py-1 rounded bg-gray-300"
          onClick={() => handlePageChange(filters.page + 1)}
        >Next</button>
      </div>
    </div>
  )
}