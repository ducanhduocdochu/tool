"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TenMinuteDatetimePicker from "../ui/pickerdate";

export default function TaskAddDialog({
  open,
  onOpenChange,
  form,
  handleFormChange,
  handleSubmit,
  statusOptions,
  priorityOptions,
  setShowDialog,
  loading,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-6xl min-w-[1200px] h-[700px] rounded-2xl border-0 
        bg-white text-black 
        dark:bg-[#24262b] dark:text-white 
        shadow-2xl fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold">Add Task</DialogTitle>
        </DialogHeader>

        <form
          className="flex flex-col mx-12 gap-8 py-6 h-[500px] justify-center"
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          {/* Title */}
          <div className="flex items-center gap-4">
            <span className="font-semibold text-xl min-w-[130px]">Title:</span>
            <Input
              name="title"
              value={form.title}
              onChange={(e) => handleFormChange("title", e.target.value)}
              placeholder="Task title"
              required
              className="flex-1 bg-white dark:bg-white text-black dark:text-black"
            />
          </div>

          {/* Description */}
          <div className="flex items-center gap-4">
            <span className="font-semibold text-xl min-w-[130px]">
              Description:
            </span>
            <Input
              name="description"
              value={form.description}
              onChange={(e) => handleFormChange("description", e.target.value)}
              placeholder="Description"
              className="flex-1 bg-white dark:bg-white text-black dark:text-black"
            />
          </div>

          {/* Progress */}
          <div className="flex items-center gap-4">
            <span className="font-semibold text-xl min-w-[130px]">
              Progress:
            </span>
            <div className="flex-1 flex items-center">
              <input
                name="progress"
                type="range"
                min={0}
                max={100}
                value={form.progress}
                onChange={(e) => handleFormChange("progress", e.target.value)}
                className="w-96 accent-blue-600"
              />
              <span className="mx-3 w-12 text-lg text-blue-700 dark:text-white">
                {form.progress}%
              </span>
            </div>
          </div>

          {/* Status, Priority, Tags */}
          {/* Status */}
          <div className="flex items-center gap-4">
            <span className="font-semibold text-xl min-w-[130px]">Status:</span>
            <Select
              value={form.status}
              onValueChange={(v) => handleFormChange("status", v)}
            >
              <SelectTrigger className="w-36 bg-white dark:bg-white text-black dark:text-black">
                {form.status
                  ? statusOptions.find((opt) => opt.value === form.status)
                      ?.label
                  : "Status"}
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Priority */}
          <div className="flex items-center gap-4">
            <span className="font-semibold text-xl min-w-[130px]">
              Priority:
            </span>
            <Select
              value={form.priority}
              onValueChange={(v) => handleFormChange("priority", v)}
            >
              <SelectTrigger className="w-36 bg-white dark:bg-white text-black dark:text-black">
                {form.priority
                  ? priorityOptions.find((opt) => opt.value === form.priority)
                      ?.label
                  : "Priority"}
              </SelectTrigger>
              <SelectContent>
                {priorityOptions.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tags */}
          <div className="flex items-center gap-4">
            <span className="font-semibold text-xl min-w-[130px]">Tags:</span>
            <Input
              name="tags"
              value={form.tags}
              onChange={(e) => handleFormChange("tags", e.target.value)}
              placeholder="Tags (comma separated)"
              className="flex-1 bg-white dark:bg-white text-black dark:text-black"
            />
          </div>

          {/* StartTime */}
          <div className="flex items-center gap-4">
            <span className="font-semibold text-xl min-w-[130px]">Start:</span>

            <TenMinuteDatetimePicker
              value={form.startTime}
              onChange={(v) => handleFormChange("startTime", v)}
              className="w-80"
            />
          </div>

          {/* EndTime */}
          <div className="flex items-center gap-4">
            <span className="font-semibold text-xl min-w-[130px]">End:</span>

            <TenMinuteDatetimePicker
              value={form.endTime}
              onChange={(v) => handleFormChange("endTime", v)}
              className="w-80"
            />
          </div>

          {/* Footer */}
          <DialogFooter>
            <Button
              type="submit"
              className="font-bold shadow cursor-pointer"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 00-8 8h4z"
                    />
                  </svg>
                  Creating...
                </span>
              ) : (
                "Create"
              )}
            </Button>
            <DialogClose asChild>
              <Button
                type="button"
                variant="secondary"
                className="font-bold shadow cursor-pointer"
                onClick={() => setShowDialog(false)}
              >
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
