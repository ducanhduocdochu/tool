"use client"

import { useCallback, useEffect, useState } from "react"
import { useTheme as useNextTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import TaskDetailDialog from "@/components/Tasks/TaskDetailDialog"
import TaskAddDialog from "@/components/Tasks/TaskAddDialog"
import TaskManagerView from "@/components/Tasks/TaskManagerView"
import ScheduleView from "@/components/Tasks/ScheduleView"

const statusColors = {
  pending: "bg-yellow-400 text-yellow-900",
  in_progress: "bg-blue-500 text-blue-50",
  completed: "bg-green-500 text-green-50",
  canceled: "bg-gray-500 text-gray-100",
}

const priorityColors = {
  low: "bg-blue-100 text-blue-700",
  medium: "bg-yellow-200 text-yellow-800",
  high: "bg-orange-400 text-orange-900",
  urgent: "bg-red-500 text-red-50",
}

const statusFilterOptions = [
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "canceled", label: "Canceled" },
]
const priorityFilterOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
]

const statusOptions = [...statusFilterOptions]
const priorityOptions = [...priorityFilterOptions]

export default function TasksPage() {
  const [activeTab, setActiveTab] = useState("tasks")

  return (
    <div className="max-w-7xl mx-auto px-2 py-10 min-h-screen transition-colors">
      <div className="flex justify-between mb-4 items-center">
        <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
        <div className="flex gap-2 [&>*]:transition-none">
          <Button
            className="transition-none"
            variant={activeTab === "tasks" ? "default" : "outline"}
            onClick={() => setActiveTab("tasks")}
          >
            Task Manager
          </Button>
          <Button
            className="transition-none"
            variant={activeTab === "schedule" ? "default" : "outline"}
            onClick={() => setActiveTab("schedule")}
          >
            Schedule View
          </Button>
          <Button
            className="transition-none"
            variant={activeTab === "dashboard" ? "default" : "outline"}
            onClick={() => setActiveTab("dashboard")}
          >
            Dashboard
          </Button>
        </div>
      </div>

      <div className={activeTab === "tasks" ? "block" : "hidden"}>
        <TaskManagerView
          statusColors={statusColors}
          priorityColors={priorityColors}
          statusFilterOptions={statusFilterOptions}
          priorityFilterOptions={priorityFilterOptions}
          statusOptions={statusOptions}
          priorityOptions={priorityOptions}
        />
      </div>
      <div className={activeTab === "schedule" ? "block" : "hidden"}>
        <ScheduleView statusColors={statusColors}
          priorityColors={priorityColors}
          statusFilterOptions={statusFilterOptions}
          priorityFilterOptions={priorityFilterOptions}
          statusOptions={statusOptions}
          priorityOptions={priorityOptions} />
      </div>
      <div className={activeTab === "dashboard" ? "block" : "hidden"}>
        <div className="text-center text-gray-500 py-20">Dashboard đang phát triển...</div>
      </div>
    </div>
  )
}