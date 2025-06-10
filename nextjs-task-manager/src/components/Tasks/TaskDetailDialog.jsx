"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Pencil } from "lucide-react"

export default function TaskDetailDialog({
  open,
  onOpenChange,
  detailTask,
  statusColors,
  priorityColors,
  statusOptions,
  priorityOptions,
  showDeleteDialog,
  setShowDeleteDialog,
  onUpdate,
}) {
  // State cho edit
  const [editField, setEditField] = useState(null)
  const [editValue, setEditValue] = useState("")

  // Helper render control  
  const renderEditControl = (field, value) => {
    if (field === "status")
      return (
        <Select value={editValue} onValueChange={v => setEditValue(v)}>
          <SelectTrigger className="w-56" />
          <SelectContent>
            {statusOptions.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    if (field === "priority")
      return (
        <Select value={editValue} onValueChange={v => setEditValue(v)}>
          <SelectTrigger className="w-56" />
          <SelectContent>
            {priorityOptions.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    if (field === "progress")
      return (
        <input
          type="range"
          min={0}
          max={100}
          value={editValue}
          onChange={e => setEditValue(e.target.value)}
          className="w-96 accent-blue-600"
        />
      )
    if (field === "tags")
      return (
        <Input
          value={editValue}
          onChange={e => setEditValue(e.target.value)}
          className="w-[340px]"
          placeholder="Tags (comma separated)"
        />
      )
    if (field === "startTime" || field === "endTime")
      return (
        <Input
          type="datetime-local"
          value={editValue}
          onChange={e => setEditValue(e.target.value)}
          className="w-80"
        />
      )
    // title, description mặc định
    return (
      <Input value={editValue} onChange={e => setEditValue(e.target.value)} className="w-full" />
    )
  }

  // Bắt đầu sửa trường
  const startEdit = (field, value) => {
    setEditField(field)
    if (field === "startTime" || field === "endTime") {
      setEditValue(
        value
          ? new Date(value).toISOString().slice(0, 16)
          : ""
      )
    } else if (field === "tags") {
      setEditValue((value || []).join(", "))
    } else {
      setEditValue(value ?? "")
    }
  }

  // Update
  const handleUpdate = () => {
    if (!editField) return
    let value = editValue
    if (editField === "progress") value = Number(value)
    if (editField === "tags") value = value.split(",").map(t => t.trim()).filter(Boolean)
    if (editField === "startTime" || editField === "endTime") value = value ? new Date(value) : undefined
    onUpdate(editField, value)
    setEditField(null)
  }

  // Cancel
  const handleCancel = () => {
    setEditField(null)
    setEditValue("")
  }

  // Helper hiển thị tags badge
  const renderTags = tags =>
    tags && tags.length > 0
      ? tags.map(tag => (
          <Badge key={tag} className="mr-2 px-2 py-1 bg-blue-100 text-blue-700">{tag}</Badge>
        ))
      : <span className="italic text-muted-foreground">No tags</span>

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="max-w-6xl min-w-[1200px] h-[700px] rounded-2xl border-0 dark:bg-[#24262b]"
        >
          <DialogHeader>
            <DialogTitle className="text-3xl">Task Detail</DialogTitle>
          </DialogHeader>
          {detailTask && (
            <div className="flex flex-col  mx-12 gap-8 py-6 h-[500px] justify-center">
              {/* Title */}
              <div className="flex items-center gap-4">
                <span className="font-semibold text-xl min-w-[130px]">Title:</span>
                <div className="flex-1 flex items-center">
                  {editField === "title"
                    ? (
                      <>
                        {renderEditControl("title", detailTask.title)}
                        <Button className="ml-2 cursor-pointer" onClick={handleUpdate}>Update</Button>
                        <Button variant="ghost" className='cursor-pointer' onClick={handleCancel}>Cancel</Button>
                      </>
                    )
                    : (
                      <>
                        <span className="text-lg truncate">{detailTask.title}</span>
                        <Button size="icon" variant="ghost" className="ml-2 cursor-pointer" onClick={() => startEdit("title", detailTask.title)}>
                          <Pencil className="w-5 h-5" />
                        </Button>
                      </>
                    )
                  }
                </div>
              </div>
              {/* Description */}
              <div className="flex items-center gap-4">
                <span className="font-semibold text-xl min-w-[130px]">Description:</span>
                <div className="flex-1 flex items-center">
                  {editField === "description"
                    ? (
                      <>
                        {renderEditControl("description", detailTask.description)}
                        <Button className="ml-2 cursor-pointer" onClick={handleUpdate}>Update</Button>
                        <Button variant="ghost" className='cursor-pointer' onClick={handleCancel}>Cancel</Button>
                      </>
                    )
                    : (
                      <>
                        <span className="text-lg truncate">{detailTask.description || <span className="italic text-muted-foreground">No description</span>}</span>
                        <Button size="icon" variant="ghost" className="ml-2 cursor-pointer" onClick={() => startEdit("description", detailTask.description)}>
                          <Pencil className="w-5 h-5" />
                        </Button>
                      </>
                    )
                  }
                </div>
              </div>
              {/* Progress */}
              <div className="flex items-center gap-4">
                <span className="font-semibold text-xl min-w-[130px]">Progress:</span>
                <div className="flex-1 flex items-center">
                  {editField === "progress"
                    ? (
                      <>
                        {renderEditControl("progress", detailTask.progress)}
                        <span className="mx-3 w-12 text-lg text-blue-700">{editValue}%</span>
                        <Button className="ml-2 cursor-pointer" onClick={handleUpdate}>Update</Button>
                        <Button variant="ghost" className='cursor-pointer' onClick={handleCancel}>Cancel</Button>
                      </>
                    )
                    : (
                      <>
                        <div className="w-3/4 flex items-center">
                          <div className="w-full h-4 bg-gray-200 rounded-lg overflow-hidden mr-4">
                            <div
                              className="h-4 bg-blue-500 rounded-lg transition-all"
                              style={{ width: `${detailTask.progress}%` }}
                            />
                          </div>
                          <span className="text-lg font-semibold w-12">{detailTask.progress}%</span>
                        </div>
                        <Button size="icon" variant="ghost" className="ml-2 cursor-pointer" onClick={() => startEdit("progress", detailTask.progress)}>
                          <Pencil className="w-5 h-5" />
                        </Button>
                      </>
                    )
                  }
                </div>
              </div>
              {/* Status, Priority, Tags */}
              <div className="flex items-center gap-10">
                {/* Status */}
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xl">Status:</span>
                  {editField === "status"
                    ? (
                      <>
                        {renderEditControl("status", detailTask.status)}
                        <Button className="ml-2 cursor-pointer" onClick={handleUpdate}>Update</Button>
                        <Button variant="ghost" className='cursor-pointer' onClick={handleCancel}>Cancel</Button>
                      </>
                    )
                    : (
                      <>
                        <Badge className={"text-base px-3 py-2 rounded-full " + (statusColors[detailTask.status] || "")}>
                          {detailTask.status}
                        </Badge>
                        <Button size="icon" variant="ghost" className="ml-1 cursor-pointer" onClick={() => startEdit("status", detailTask.status)}>
                          <Pencil className="w-5 h-5" />
                        </Button>
                      </>
                    )
                  }
                </div>
                {/* Priority */}
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xl">Priority:</span>
                  {editField === "priority"
                    ? (
                      <>
                        {renderEditControl("priority", detailTask.priority)}
                        <Button className="ml-2 cursor-pointer" onClick={handleUpdate}>Update</Button>
                        <Button variant="ghost" className='cursor-pointer' onClick={handleCancel}>Cancel</Button>
                      </>
                    )
                    : (
                      <>
                        <Badge className={"text-base px-3 py-2 rounded-full " + (priorityColors[detailTask.priority] || "")}>
                          {detailTask.priority}
                        </Badge>
                        <Button size="icon" variant="ghost" className="ml-1 cursor-pointer" onClick={() => startEdit("priority", detailTask.priority)}>
                          <Pencil className="w-5 h-5" />
                        </Button>
                      </>
                    )
                  }
                </div>
                {/* Tags */}
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xl">Tags:</span>
                  {editField === "tags"
                    ? (
                      <>
                        {renderEditControl("tags", detailTask.tags)}
                        <Button className="ml-2 cursor-pointer" onClick={handleUpdate}>Update</Button>
                        <Button variant="ghost" className='cursor-pointer' onClick={handleCancel}>Cancel</Button>
                      </>
                    )
                    : (
                      <>
                        <div className="flex flex-wrap">{renderTags(detailTask.tags)}</div>
                        <Button size="icon" variant="ghost" className="ml-1 cursor-pointer" onClick={() => startEdit("tags", detailTask.tags)}>
                          <Pencil className="w-5 h-5" />
                        </Button>
                      </>
                    )
                  }
                </div>
              </div>
              {/* StartTime */}
              <div className="flex items-center gap-4">
                <span className="font-semibold text-xl min-w-[130px]">Start:</span>
                <div className="flex-1 flex items-center">
                  {editField === "startTime"
                    ? (
                      <>
                        {renderEditControl("startTime", detailTask.startTime)}
                        <Button className="ml-2 cursor-pointer" onClick={handleUpdate}>Update</Button>
                        <Button variant="ghost" className='cursor-pointer' onClick={handleCancel}>Cancel</Button>
                      </>
                    )
                    : (
                      <>
                        <span>
                          {detailTask.startTime ? new Date(detailTask.startTime).toLocaleString() : <span className="italic text-muted-foreground">N/A</span>}
                        </span>
                        <Button size="icon" variant="ghost" className="ml-2 cursor-pointer" onClick={() => startEdit("startTime", detailTask.startTime)}>
                          <Pencil className="w-5 h-5" />
                        </Button>
                      </>
                    )
                  }
                </div>
              </div>
              {/* EndTime */}
              <div className="flex items-center gap-4">
                <span className="font-semibold text-xl min-w-[130px]">End:</span>
                <div className="flex-1 flex items-center">
                  {editField === "endTime"
                    ? (
                      <>
                        {renderEditControl("endTime", detailTask.endTime)}
                        <Button className="ml-2 cursor-pointer" onClick={handleUpdate}>Update</Button>
                        <Button variant="ghost" className='cursor-pointer' onClick={handleCancel}>Cancel</Button>
                      </>
                    )
                    : (
                      <>
                        <span>
                          {detailTask.endTime ? new Date(detailTask.endTime).toLocaleString() : <span className="italic text-muted-foreground">N/A</span>}
                        </span>
                        <Button size="icon" variant="ghost" className="ml-2 cursor-pointer" onClick={() => startEdit("endTime", detailTask.endTime)}>
                          <Pencil className="w-5 h-5" />
                        </Button>
                      </>
                    )
                  }
                </div>
              </div>
              {/* createdAt */}
              <div className="flex items-center gap-4">
                <span className="font-semibold text-xl min-w-[130px]">Created At:</span>
                <div className="flex-1 flex items-center">
                  <span>
                    {detailTask.createdAt ? new Date(detailTask.createdAt).toLocaleString() : <span className="italic text-muted-foreground">N/A</span>}
                  </span>
                </div>
              </div>
              {/* updatedAt */}
              <div className="flex items-center gap-4">
                <span className="font-semibold text-xl min-w-[130px]">Updated At:</span>
                <div className="flex-1 flex items-center">
                  <span>
                    {detailTask.updatedAt ? new Date(detailTask.updatedAt).toLocaleString() : <span className="italic text-muted-foreground">N/A</span>}
                  </span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              className='cursor-pointer'
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
            >
              Xóa
            </Button>
            <DialogClose asChild>
              <Button className='cursor-pointer' variant="secondary" type="button">
                Đóng
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}