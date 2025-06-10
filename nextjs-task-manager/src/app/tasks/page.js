'use client'
import { useEffect, useState } from 'react'

export default function Tasks() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    fetch('/api/tasks').then(res => res.json()).then(setTasks)
  }, [])

  const addTask = async (e) => {
    e.preventDefault()
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }),
    })
    const newTask = await res.json()
    setTasks([newTask, ...tasks])
    setTitle('')
    setDescription('')
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Tasks</h1>
      <form onSubmit={addTask} className="mb-6 space-y-2">
        <input
          className="border p-2 w-full"
          placeholder="Task title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        <textarea
          className="border p-2 w-full"
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Add Task</button>
      </form>
      <div className="space-y-4">
        {tasks.map(task => (
          <div key={task.id} className="p-4 border rounded bg-white">
            <h2 className="font-semibold">{task.title}</h2>
            <p>{task.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}