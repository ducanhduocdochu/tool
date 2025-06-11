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

// For filter
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

// For form (no "all" option)
const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "canceled", label: "Canceled" },
]
const priorityOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
]

export default function TasksPage() {
  const [tasks, setTasks] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    q: "",
    tags: "",
    page: 1,
    pageSize: 10,
    startFrom: "",
    endTo: "",
  })
  const [showDialog, setShowDialog] = useState(false)
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "pending",
    priority: "medium",
    progress: 0,
    tags: "",
    note: "",
    startTime: "",
    endTime: "",
  })

  // Thêm state cho task chi tiết
  const [detailTask, setDetailTask] = useState(null)
  const [showDetailDialog, setShowDetailDialog] = useState(false)

  const { setTheme: setNextTheme, resolvedTheme } = useNextTheme()

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

  // Handle filter change
  const handleFiltersChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value, page: 1 }))
  }

  // Pagination
  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }))
  }

  // form handlers
  const handleFormChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  // Create new task
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title) return alert("Title is required")
    const body = {
      ...form,
      tags: form.tags
        ? form.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : [],
      progress: Number(form.progress || 0),
      startTime: form.startTime ? new Date(form.startTime) : undefined,
      endTime: form.endTime ? new Date(form.endTime) : undefined,
    }
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    if (res.ok) {
      setForm({
        title: "",
        description: "",
        status: "pending",
        priority: "medium",
        progress: 0,
        tags: "",
        startTime: "",
        endTime: "",
      })
      setShowDialog(false)
      fetchTasks()
    } else {
      alert("Error saving task")
    }
  }

  // Khi nhấn vào từng task trong bảng, hiển thị chi tiết
  const handleRowClick = (task) => {
    setDetailTask(task)
    setShowDetailDialog(true)
  }

  const [editField, setEditField] = useState(null); // tên trường đang sửa, ví dụ "title"
  const [editValue, setEditValue] = useState("");   // giá trị đang sửa
  const [showDeleteDialog, setShowDeleteDialog] = useState(false); // popup xác nhận xóa

  const handleSaveEdit = async (field) => {
    if (!editField || !detailTask) return;
    const res = await fetch(`/api/tasks`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: editValue }),
    });
    if (res.ok) {
      const updated = await res.json();
      setDetailTask(updated);
      setEditField(null);
      fetchTasks();
    } else {
      alert("Cập nhật thất bại!");
    }
  };

  const dateTimeFormatter = new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  })

  // UI
  return (
    <div className="max-w-5xl mx-auto px-2 py-10 min-h-screen transition-colors">
      {/* Header and theme toggle */}
      <div className="flex items-center justify-between mb-8 gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
        
        <div className="flex items-center gap-2">
          <Button onClick={() => setShowDialog(true)}>+ Add Task</Button>
        </div>
      </div>

      <div className="flex gap-2 mt-2">
  <Button
    variant={resolvedTheme === "light" ? "default" : "secondary"}
    className="rounded-full px-4"
    onClick={() => window.location.href = "/tasks"}
  >
    Tasks Manager
  </Button>
  <Button
    variant={resolvedTheme === "light" ? "ghost" : "outline"}
    className="rounded-full px-4"
    onClick={() => window.location.href = "/schedule"}
  >
    Schedule View
  </Button>
  <Button
    variant={resolvedTheme === "light" ? "ghost" : "outline"}
    className="rounded-full px-4"
    onClick={() => window.location.href = "/dashboard"}
  >
    Dashboard
  </Button>
</div>

      {/* Filter */}
      <div className="mb-8 flex flex-wrap gap-4 bg-muted p-4 rounded-lg border">
        <Input
          name="q"
          value={filters.q}
          onChange={(e) => handleFiltersChange("q", e.target.value)}
          placeholder="Search..."
          className="w-80"
        />
        <Select
          value={filters.status}
          onValueChange={(v) => handleFiltersChange("status", v)}
        >
          <SelectTrigger className="w-36">
            {
              statusFilterOptions.find(opt => opt.value === filters.status)?.label || "All status"
            }
          </SelectTrigger>
          <SelectContent>
            {statusFilterOptions.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filters.priority}
          onValueChange={(v) => handleFiltersChange("priority", v)}
        >
          <SelectTrigger className="w-36">
            {
              priorityFilterOptions.find(opt => opt.value === filters.priority)?.label || "All priority"
            }
          </SelectTrigger>
          <SelectContent>
            {priorityFilterOptions.map((p) => (
              <SelectItem key={p.value} value={p.value}>
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          name="tags"
          value={filters.tags}
          onChange={(e) => handleFiltersChange("tags", e.target.value)}
          placeholder="Tags (comma separated)"
          className="w-48"
        />
        <div className="flex items-center gap-2">
          <span className="font-semibold">Start:</span>
          <Input
            name="startFrom"
            type="date"
            value={filters.startFrom}
            onChange={e => handleFiltersChange("startFrom", e.target.value)}
            className="w-40"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold">End:</span>
          <Input
            name="endTo"
            type="date"
            value={filters.endTo}
            onChange={e => handleFiltersChange("endTo", e.target.value)}
            className="w-40"
          />
        </div>
        <Button variant="secondary" className='cursor-pointer' onClick={fetchTasks} type="button">
          Filter
        </Button>
      </div>

      {/* Task List */}
      <div className="rounded-lg border shadow bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px] pl-4">Title</TableHead>
              <TableHead className="w-[100px] pl-4">Status</TableHead>
              <TableHead className="w-[100px] pl-4">Priority</TableHead>
              <TableHead className="w-[120px]">Progress</TableHead>
              <TableHead className="w-[180px]">Tags</TableHead>
              <TableHead className="w-[180px]">Start</TableHead>
              <TableHead className="w-[180px]">End</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : tasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  No tasks found
                </TableCell>
              </TableRow>
            ) : (
              tasks.map((task) => (
                <TableRow
                  key={task.id}
                  className="border-t cursor-pointer hover:bg-accent/40"
                  onClick={() => handleRowClick(task)}
                >
                  <TableCell className="font-medium pl-4">{task.title}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        "text-xs px-2 py-1 rounded-full " +
                        (statusColors[task.status] || "")
                      }
                    >
                      {task.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        "text-xs px-2 py-1 rounded-full " +
                        (priorityColors[task.priority] || "")
                      }
                    >
                      {task.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        "text-xs px-2 py-1 rounded-full min-w-[2rem] " +
                        (task.progress >= 100
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800")
                      }
                    >
                      {task.progress}%
                    </Badge>
                  </TableCell>
                  <TableCell>{task.tags && task.tags.join(", ")}</TableCell>
                  <TableCell>
                    {task.startTime ? dateTimeFormatter.format(new Date(task.startTime)) : ""}
                  </TableCell>
                  <TableCell>
                    {task.endTime ? dateTimeFormatter.format(new Date(task.endTime)) : ""}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex gap-2 mt-4 justify-end items-center">
        <span>
          Page {filters.page} / {Math.max(1, Math.ceil(total / filters.pageSize))}
        </span>
        <Button
          variant="outline"
          disabled={filters.page <= 1}
          onClick={() => handlePageChange(filters.page - 1)}
        >
          Prev
        </Button>
        <Button
          variant="outline"
          disabled={filters.page >= Math.ceil(total / filters.pageSize)}
          onClick={() => handlePageChange(filters.page + 1)}
        >
          Next
        </Button>
      </div>

      {/* Add Task Dialog */}
      <TaskAddDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        form={form}
        handleFormChange={handleFormChange}
        handleSubmit={handleSubmit}
        statusOptions={statusOptions}
        priorityOptions={priorityOptions}
        setShowDialog={setShowDialog}
      />

      {/* Task Detail Dialog */}
      <TaskDetailDialog
        open={showDetailDialog}
        onOpenChange={setShowDetailDialog}
        detailTask={detailTask}
        statusColors={statusColors}
        priorityColors={priorityColors}
        statusOptions={statusOptions}
        priorityOptions={priorityOptions}
        showDeleteDialog={showDeleteDialog}
        setShowDeleteDialog={setShowDeleteDialog}
        onUpdate={async (field, value) => {
          const res = await fetch(`/api/tasks`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: detailTask.id, [field]: value }),
          })
          if (res.ok) {
            const updated = await res.json()
            setDetailTask(updated)
            fetchTasks()
          } else {
            alert("Cập nhật thất bại!")
          }
        }}
      />
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-sm w-full">
          <DialogHeader>
            <DialogTitle>Xác nhận xóa Task</DialogTitle>
          </DialogHeader>
          <div>
            Bạn có chắc chắn muốn xóa task này không?
          </div>
          <DialogFooter>
            <Button
              className='cursor-pointer'
              variant="destructive"
              onClick={async () => {
                if (!detailTask) return;
                const res = await fetch(`/api/tasks`, {
                  method: "DELETE",
                  headers: {
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify({ id: detailTask.id })
                })
                if (res.ok) {
                  setShowDeleteDialog(false);
                  setShowDetailDialog(false);
                  setDetailTask(null);
                  fetchTasks();
                } else {
                  alert("Xóa task thất bại!");
                }
              }}
            >
              Xóa
            </Button>
            <DialogClose asChild>
              <Button
                className='cursor-pointer'
                type="button"
                variant="secondary"
                onClick={() => setShowDeleteDialog(false)}
              >
                Hủy
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}