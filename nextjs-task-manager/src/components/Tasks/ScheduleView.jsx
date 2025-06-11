import React, { useCallback, useEffect, useState } from "react"
import {
  format,
  startOfWeek,
  addDays,
  addWeeks,
  isSameDay,
  parseISO,
} from "date-fns"
import {
  ClockIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@radix-ui/react-icons"

export default function ScheduleView() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [weekOffset, setWeekOffset] = useState(0)
  const [filters] = useState({ pageSize: 100 })

  const thisMonday = startOfWeek(new Date(), { weekStartsOn: 1 })
  const startWeek = addWeeks(thisMonday, weekOffset)
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startWeek, i))
  const hours = Array.from({ length: 13 }, (_, i) => `${(8 + i).toString().padStart(2, "0")}:00`)

  const priorityColors = {
    high: "border-red-500 bg-red-50 text-red-800",
    medium: "border-yellow-400 bg-yellow-50 text-yellow-800",
    low: "border-green-500 bg-green-50 text-green-800",
    urgent: "border-pink-500 bg-pink-50 text-pink-800",
  }

  const fetchTasks = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ pageSize: filters.pageSize })
    const res = await fetch(`/api/tasks?${params}`)
    const data = await res.json()
    setTasks(data.tasks)
    setLoading(false)
  }, [filters.pageSize])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const tasksOfDay = (day) =>
    tasks
      .filter((t) => t.startTime && isSameDay(new Date(t.startTime), day))
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))

  return (
    <div className="overflow-x-auto select-none">
      <div className="flex items-center justify-between px-4 py-2">
        <Button variant="ghost" size="icon" onClick={() => setWeekOffset((o) => o - 1)}>
          <ChevronLeftIcon className="w-5 h-5" />
        </Button>
        <h2 className="text-lg font-semibold">
          Week of {format(startWeek, "dd MMM yyyy")} – {format(addDays(startWeek, 6), "dd MMM yyyy")}
        </h2>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => setWeekOffset((o) => o + 1)}>
            <ChevronRightIcon className="w-5 h-5" />
          </Button>
          {weekOffset !== 0 && (
            <Button variant="outline" onClick={() => setWeekOffset(0)}>
              Today
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-8 min-w-[1152px] gap-3 px-2 pb-6">
        <div className="flex flex-col gap-2 items-center pt-10">
          {hours.map((hour) => (
            <div key={hour} className="h-[40px] text-xs text-gray-500">
              {hour}
            </div>
          ))}
        </div>

        {weekDays.map((day) => (
          <div
            key={day.toISOString()}
            className="bg-[#f9fbfd] rounded-xl px-2 pt-3 pb-2 min-h-[540px] border border-gray-200 shadow-sm flex flex-col"
          >
            <div className="text-center mb-3 border-b pb-1">
              <div className="text-sm font-bold text-blue-700 uppercase">
                {format(day, "EEE dd.MM")}
              </div>
              <div className="text-xs text-gray-400">8h of 8h</div>
            </div>

            <div className="flex-1 flex flex-col gap-2 overflow-y-auto">
              {tasksOfDay(day).length === 0 && !loading && (
                <div className="text-center text-gray-400 text-sm italic mt-8">No tasks</div>
              )}
              {loading && (
                <div className="text-center text-gray-400 text-sm italic mt-8">Loading...</div>
              )}
              {tasksOfDay(day).map((task) => (
                <div
                  key={task.id}
                  className={`border-l-4 pl-3 pr-2 py-2 rounded-md bg-white shadow-sm text-sm ${
                    priorityColors[task.priority] || "border-gray-400"
                  }`}
                >
                  <div className="text-[13px] font-semibold leading-tight truncate">
                    {task.title}
                  </div>
                  <div className="flex items-center justify-between mt-1 text-xs">
                    <div className="text-gray-500 font-medium">
                      {task.code || "TASK-001"}
                    </div>
                    <div className="flex items-center gap-1 text-green-700 font-semibold">
                      <ClockIcon className="w-3 h-3" /> {format(parseISO(task.startTime), "HH:mm")}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Button({ children, variant = "ghost", size, ...props }) {
  const base = "flex items-center justify-center rounded hover:bg-gray-200 dark:hover:bg-gray-700"
  const variants = {
    ghost: "bg-transparent",
    outline: "border border-gray-300 px-3 py-1 text-sm",
  }
  const sizes = {
    icon: "w-8 h-8",
  }
  return (
    <button
      {...props}
      className={`${base} ${variants[variant]} ${size ? sizes[size] : "px-2 py-1"}`}
    >
      {children}
    </button>
  )
}
