"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  format,
  startOfWeek,
  addDays,
  addWeeks,
  isSameDay,
  parseISO,
} from "date-fns";
import {
  ClockIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import TaskAddDialog from "./TaskAddDialog";
import TaskDetailDialog from "./TaskDetailDialog";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button as Button2 } from "../ui/button";

export default function ScheduleView({
  statusColors,
  statusFilterOptions,
  priorityFilterOptions,
  statusOptions,
  priorityOptions,
}) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);
  const [filters] = useState({ pageSize: 100 });
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [detailTask, setDetailTask] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [draggingTask, setDraggingTask] = useState(null);
  const [dragPos, setDragPos] = useState(null);
  const [resizingTask, setResizingTask] = useState(null); // {taskId, type: "start"|"end"}
  const [resizePos, setResizePos] = useState(null); // {dayIdx, slotIdx}
  const resizePosRef = useRef(resizePos);
  useEffect(() => {
    resizePosRef.current = resizePos;
  }, [resizePos]);

  // async function handleResizeCommit() {
  //  const currentResizePos = resizePosRef.current;
  //   if (!resizingTask || !currentResizePos) {
  //     setResizingTask(null);
  //     setResizePos(null);
  //     document.body.style.userSelect = "";
  //     return;
  //   }

  //   setLoading2(true);
  //   const task = tasks.find(t => t.id === resizingTask.taskId);
  //   let newStart = new Date(task.startTime);
  //   let newEnd = new Date(task.endTime);

  //   if (resizingTask.type === "start") {
  //     const hour = Math.floor(currentResizePos .slotIdx / 6);
  //     const minute = (currentResizePos .slotIdx % 6) * 10;
  //     newStart = new Date(newStart.getFullYear(), newStart.getMonth(), newStart.getDate(), hour, minute, 0, 0);
  //     if (newStart >= newEnd) {
  //       newStart = new Date(newEnd.getTime() - 10 * 60000); // Ensure start time is before end time
  //     }
  //   } else if (resizingTask.type === "end") {
  //     const hour = Math.floor(currentResizePos .slotIdx / 6);
  //     const minute = (currentResizePos .slotIdx % 6) * 10;
  //     newEnd = new Date(newEnd.getFullYear(), newEnd.getMonth(), newEnd.getDate(), hour, minute, 0, 0);
  //     if (newEnd <= newStart) {
  //       newEnd = new Date(newStart.getTime() + 10 * 60000); // Ensure end time is after start time
  //     }
  //   }

  //   // Update task with new start and end times
  //   await fetch(`/api/tasks`, {
  //     method: "PUT",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({
  //       id: task.id,
  //       startTime: newStart,
  //       endTime: newEnd,
  //     }),
  //   });

  //   setResizingTask(null);
  //   setResizePos(null);
  //   setLoading2(false);
  //   document.body.style.userSelect = "";
  //   fetchTasks();
  // }

  // Mouse move khi resize
  // useEffect(() => {
  //   if (!resizingTask) return;
  //   function onMouseMove(e) {
  //   console.log('[RESIZE] onMouseMove CALLED', {e, resizingTask});
  //     const col = document.querySelector(`[data-day-idx="${resizingTask.dayIdx}"]`);
  //     if (!col) return;
  //     const rect = col.getBoundingClientRect();
  //     const y = e.clientY - rect.top;
  //     const afterHeader = y - 56;
  //     if (afterHeader < 0) return;

  //     const slotIdx = Math.max(0, Math.min(143, Math.floor(afterHeader / 24)));
  //     console.log("[RESIZE] MouseMove", { dayIdx: resizingTask.dayIdx, slotIdx });
  //     setResizePos({ dayIdx: resizingTask.dayIdx, slotIdx });
  //   }

  //   function onMouseUp() {
  //     console.log("[RESIZE] MouseUp", { resizingTask, resizePos });
  //     handleResizeCommit();
  //     document.body.style.userSelect = "";
  //   }

  //   window.addEventListener("mousemove", onMouseMove);
  //   window.addEventListener("mouseup", onMouseUp);

  //   return () => {
  //     window.removeEventListener("mousemove", onMouseMove);
  //     window.removeEventListener("mouseup", onMouseUp);
  //   };
  // }, [resizingTask]);

  function getTaskSlotIdx(task) {
    const date = new Date(task.startTime);
    return date.getHours() * 6 + Math.floor(date.getMinutes() / 10);
  }

  useEffect(() => {
    if (!draggingTask) return;
    const onMouseUp = () => handleDragCancel();
    window.addEventListener("mouseup", onMouseUp);
    return () => window.removeEventListener("mouseup", onMouseUp);
  }, [draggingTask]);

  // Bắt đầu kéo
  function handleTaskDragStart(task, dayIdx, slotIdx, e) {
    e.stopPropagation();
    setDraggingTask({
      ...task,
      originalDayIdx: dayIdx,
      originalSlotIdx: slotIdx,
    });
    setDragPos({ dayIdx, slotIdx });
    document.body.style.userSelect = "none";
  }

  // Trong grid slot: di chuyển chuột sang slot mới
  function handleSlotDragOver(dayIdx, slotIdx, e) {
    e.preventDefault();
    if (draggingTask) setDragPos({ dayIdx, slotIdx });
  }

  function getGridRowBySlot(day, slotIdx, durationMin) {
    // slotIdx: chỉ số slot trong ngày (0...143), mỗi slot 10 phút
    // durationMin: duration của task (phút)
    const rowStart = slotIdx + 2; // +2 vì hàng 1 header, hàng 2 là slot 0
    const slotLength = Math.ceil(durationMin / 10);
    const rowEnd = rowStart + Math.max(1, slotLength);
    return { rowStart, rowEnd };
  }

  // Thả task
  async function handleSlotDrop(dayIdx, slotIdx) {
    setLoading2(true);
    if (!draggingTask) return;
    // Tính thời gian mới
    const newDay = addDays(startWeek, dayIdx);
    const startHour = Math.floor(slotIdx / 6);
    const startMinute = (slotIdx % 6) * 10;
    const newStart = new Date(
      newDay.getFullYear(),
      newDay.getMonth(),
      newDay.getDate(),
      startHour,
      startMinute,
      0,
      0
    );
    const duration =
      new Date(draggingTask.endTime) - new Date(draggingTask.startTime);
    const newEnd = new Date(newStart.getTime() + duration);

    // Gọi API update
    await fetch(`/api/tasks`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: draggingTask.id,
        startTime: newStart,
        endTime: newEnd,
      }),
    });
    setDraggingTask(null);
    setDragPos(null);
    document.body.style.userSelect = "";
    fetchTasks();
    setLoading2(false);
  }

  // Dừng kéo (nếu thả ngoài grid)
  function handleDragCancel() {
    setDraggingTask(null);
    setDragPos(null);
    document.body.style.userSelect = "";
  }

  // Create new task
  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    if (!form.title) return alert("Title is required");
    const body = {
      ...form,
      tags: form.tags
        ? form.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
      progress: Number(form.progress || 0),
      startTime: form.startTime ? new Date(form.startTime) : undefined,
      endTime: form.endTime ? new Date(form.endTime) : undefined,
    };
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
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
      });
      setLoading(false);
      setShowDialog(false);
      fetchTasks();
    } else {
      setLoading(false);
      alert("Error saving task");
    }
  };
  const [showDialog, setShowDialog] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    progress: 0,
    status: "",
    priority: "",
    tags: "",
    startTime: "",
    endTime: "",
  });

  const handleFormChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // Days & time slots
  const thisMonday = useMemo(
    () => startOfWeek(new Date(), { weekStartsOn: 1 }),
    []
  );
  const startWeek = useMemo(
    () => addWeeks(thisMonday, weekOffset),
    [thisMonday, weekOffset]
  );
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startWeek, i));
  // 144 slots mỗi slot 10 phút
  const timeSlots = Array.from({ length: 24 * 6 }, (_, i) => {
    const hour = Math.floor(i / 6);
    const minute = (i % 6) * 10;
    return i % 6 === 0
      ? `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`
      : "";
  });

  // Màu sắc cho priority
  const priorityColors = {
    high: isDark
      ? "border-red-500 bg-[#2c1b1b] text-red-200"
      : "border-red-500 bg-red-50 text-red-800",
    medium: isDark
      ? "border-yellow-400 bg-[#232014] text-yellow-100"
      : "border-yellow-400 bg-yellow-50 text-yellow-800",
    low: isDark
      ? "border-green-500 bg-[#1b2c1b] text-green-200"
      : "border-green-500 bg-green-50 text-green-800",
    urgent: isDark
      ? "border-pink-500 bg-[#2c1b25] text-pink-200"
      : "border-pink-500 bg-pink-50 text-pink-800",
  };

  // Fetch tasks
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    const startTimeFrom = format(startWeek, "yyyy-MM-dd");
    const startTimeTo = format(addDays(startWeek, 6), "yyyy-MM-dd");
    const params = new URLSearchParams({
      pageSize: filters.pageSize,
      startTimeFrom,
      startTimeTo,
    });
    console.log({
      pageSize: filters.pageSize,
      startTimeFrom,
      startTimeTo,
    })
    const res = await fetch(`/api/tasks?${params.toString()}`);
    const data = await res.json();
    console.log(data)
    setTasks(data.tasks);
    setLoading(false);
  }, [filters.pageSize, startWeek]);

  useEffect(() => {
  fetchTasks();
}, [fetchTasks, weekOffset]);
  // Lấy task của ngày
  const tasksOfDay = (day) =>
    tasks
      .filter((t) => t.startTime && isSameDay(new Date(t.startTime), day))
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

  // Tính grid row cho task
  function getGridRow(start, end) {
    const s = typeof start === "string" ? new Date(start) : start;
    const e = typeof end === "string" ? new Date(end) : end;
    const rowStart = s.getHours() * 6 + Math.floor(s.getMinutes() / 10) + 2; // +2 vì row 1 là header, row 2 là slot 00:00
    const rowEnd = e.getHours() * 6 + Math.ceil(e.getMinutes() / 10) + 2;
    return { rowStart, rowEnd: Math.max(rowEnd, rowStart + 1) };
  }

  return (
    <div
      className={`overflow-x-auto select-none min-h-screen ${
        isDark ? "bg-[#191b1f]" : "bg-white"
      }`}
    >
      {/* Header tuần */}
      <div className="flex items-center justify-between px-4 py-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setWeekOffset((o) => o - 1)}
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </Button>
        <h2 className="text-lg font-semibold">
          Week of {format(startWeek, "dd MMM yyyy")} –{" "}
          {format(addDays(startWeek, 6), "dd MMM yyyy")}
        </h2>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setWeekOffset((o) => o + 1)}
          >
            <ChevronRightIcon className="w-5 h-5" />
          </Button>
          {weekOffset !== 0 && (
            <Button variant="outline" onClick={() => setWeekOffset(0)}>
              Today
            </Button>
          )}
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="flex px-2 pb-6 min-w-[1152px]">
        {/* Cột giờ bên trái */}
        <div className="flex flex-col w-[70px] min-w-[70px] border-r border-gray-200 dark:border-gray-700">
          {/* Header rỗng */}
          <div className="h-12" />
          {/* Slot thời gian */}
          {timeSlots.map((slot, idx) => (
            <div
              key={idx}
              className="h-[24px] text-xs text-right pr-2 text-gray-500 dark:text-gray-400 border-b border-dashed border-gray-100 dark:border-gray-700"
            >
              {slot}
            </div>
          ))}
        </div>

        {/* Lưới ngày */}
        <div className="flex-1 grid grid-cols-7 gap-4">
          {weekDays.map((day, dayIdx) => (
            <div
              key={day.toISOString()}
              style={{
                display: "grid",
                gridTemplateRows: `56px repeat(144, 24px)`,
                position: "relative",
              }}
              className={`
                rounded-xl border shadow-sm
                ${
                  isDark
                    ? "bg-[#23262a] border-gray-700"
                    : "bg-[#f9fbfd] border-gray-200"
                }
                overflow-hidden
              `}
            >
              {/* Header ngày */}
              <div className="flex items-center justify-center border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-[#23262a] sticky top-0 z-10 h-14">
                <span className="text-sm font-bold text-blue-700 dark:text-white uppercase">
                  {format(day, "EEE dd.MM")}
                </span>
              </div>
              {Array.from({ length: 144 }).map((_, slotIdx) => {
                const hour = Math.floor(slotIdx / 6);
                const minute = (slotIdx % 6) * 10;
                return (
                  <div
                    key={slotIdx}
                    data-day-idx={dayIdx}
                    onMouseOver={(e) =>
                      draggingTask && handleSlotDragOver(dayIdx, slotIdx, e)
                    }
                    onMouseUp={() =>
                      draggingTask && handleSlotDrop(dayIdx, slotIdx)
                    }
                    style={{ position: "relative", height: 24 }}
                    className={`
      border-b border-dashed
      ${isDark ? "border-gray-700" : "border-gray-100"}
      transition-colors
      hover:bg-blue-100 dark:hover:bg-blue-900 cursor-pointer
      group relative
    `}
                    onClick={() => {
                      // Helper format local datetime for input[type="datetime-local"]
                      function formatDateLocal(date) {
                        const pad = (n) => n.toString().padStart(2, "0");
                        return (
                          date.getFullYear() +
                          "-" +
                          pad(date.getMonth() + 1) +
                          "-" +
                          pad(date.getDate()) +
                          "T" +
                          pad(date.getHours()) +
                          ":" +
                          pad(date.getMinutes())
                        );
                      }

                      const start = new Date(
                        day.getFullYear(),
                        day.getMonth(),
                        day.getDate(),
                        hour,
                        minute,
                        0,
                        0
                      );
                      const end = new Date(start.getTime() + 10 * 60000);

                      const startISO = formatDateLocal(start);
                      const endISO = formatDateLocal(end);

                      setForm((f) => ({
                        ...f,
                        startTime: startISO,
                        endTime: endISO,
                      }));
                      setShowDialog(true);
                    }}
                  >
                    {draggingTask &&
                      dragPos &&
                      dragPos.dayIdx === dayIdx &&
                      dragPos.slotIdx === slotIdx &&
                      (() => {
                        // Tính duration:
                        const start = new Date(draggingTask.startTime);
                        const end = new Date(draggingTask.endTime);
                        const startHour = start.getHours();
                        const startMinute = start.getMinutes();

                        const endHour = end.getHours();
                        const endMinute = end.getMinutes();
                        const durationMin = Math.ceil(
                          -(
                            startHour * 60 +
                            startMinute -
                            endHour * 60 -
                            endMinute
                          )
                        );
                        const { rowStart, rowEnd } = getGridRowBySlot(
                          day,
                          slotIdx,
                          durationMin
                        );

                        return (
                          <div
                            className="border-2 border-dashed border-blue-400 bg-blue-100 opacity-70 pointer-events-none rounded px-2 py-1 absolute left-0 right-0 z-50"
                            style={{
                              gridRowStart: rowStart,
                              gridRowEnd: rowEnd,
                              position: "absolute",
                              left: 0,
                              right: 0,
                              top: 0,
                              margin: "2px 4px",
                              height: "48px",
                              minHeight: "24px",
                              maxHeight: "calc(100% - 4px)",
                              pointerEvents: "none",
                            }}
                          ></div>
                        );
                      })()}
                    <span className="plus-sign absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-blue-500 font-bold pointer-events-none select-none">
                      +
                    </span>
                  </div>
                );
              })}
              {/* Các task */}
              {tasksOfDay(day).map((task) => {
                const isDragging = draggingTask && draggingTask.id === task.id;
                const { rowStart, rowEnd } = getGridRow(
                  task.startTime,
                  task.endTime
                );
                return (
                  <div
                    key={task.id}
                    onMouseDown={(e) =>
                      handleTaskDragStart(task, dayIdx, getTaskSlotIdx(task), e)
                    }
                    style={{
                      gridRowStart: rowStart,
                      gridRowEnd: rowEnd,
                      zIndex: 2,
                      position: "relative",
                      margin: "2px 4px",
                      minHeight: "24px",
                      maxHeight: "calc(100% - 4px)",
                      opacity: isDragging ? 0.3 : 1,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setDetailTask(task);
                      setShowDetailDialog(true);
                    }}
                    className={`
        border-l-4 pl-3 pr-2 py-2 rounded-md shadow-sm text-sm cursor-pointer
        transition-all duration-200
        hover:z-30
        hover:scale-[1.03]
        hover:shadow-xl
        hover:ring-2 hover:ring-blue-400/60
        hover:bg-blue-50 dark:hover:bg-blue-900
        ${
          priorityColors[task.priority] ||
          (isDark
            ? "border-gray-700 bg-[#24262b] text-gray-200"
            : "border-gray-400 bg-white")
        }
      `}
                  >
                    {/* <div
    className="absolute left-0 top-0 w-full h-1 cursor-ns-resize z-10"
    style={{ pointerEvents: "auto" }}
    onMouseDown={(e) => {
    e.stopPropagation();
    setResizingTask({ taskId: task.id, type: "start", dayIdx });
  }}
  /> */}
                    <div className="text-[13px] font-semibold leading-tight truncate">
                      {task.title}
                    </div>
                    <div className="flex items-center gap-2 text-xs mt-1">
                      <span className="flex items-center gap-1 text-green-700 dark:text-green-200 font-semibold">
                        <ClockIcon className="w-3 h-3" />
                        {`${format(
                          parseISO(task.startTime),
                          "HH:mm"
                        )} - ${format(parseISO(task.endTime), "HH:mm")}`}
                      </span>
                    </div>
                    {/* <div
  className="absolute left-0 bottom-0 w-full h-1 cursor-ns-resize z-10"
  style={{ pointerEvents: "auto" }}
  onMouseDown={(e) => {
    e.stopPropagation();
    setResizingTask({ taskId: task.id, type: "end", dayIdx });
  }}
/> */}
                  </div>
                );
              })}

              {!loading && tasksOfDay(day).length === 0 && (
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: 56,
                    bottom: 0,
                    zIndex: 3,
                    pointerEvents: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  className={`text-center text-sm italic ${
                    isDark ? "text-gray-600" : "text-gray-400"
                  }`}
                >
                  No tasks
                </div>
              )}
              {loading && (
                <div
                  style={{
                    gridRowStart: 2,
                    gridRowEnd: 146,
                    zIndex: 1,
                  }}
                  className={`flex items-center justify-center text-center pointer-events-none select-none text-sm italic ${
                    isDark ? "text-gray-600" : "text-gray-400"
                  }`}
                >
                  Loading...
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <TaskAddDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        form={form}
        handleFormChange={handleFormChange}
        handleSubmit={handleSubmit}
        statusOptions={statusOptions}
        priorityOptions={priorityOptions}
        setShowDialog={setShowDialog}
        loading={loading}
      />

      <TaskDetailDialog
        open={showDetailDialog}
        onOpenChange={setShowDetailDialog}
        detailTask={detailTask}
        statusColors={statusColors}
        handleClone={() => {}}
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
          });
          if (res.ok) {
            const updated = await res.json();
            setDetailTask(updated);
            fetchTasks();
          } else {
            alert("Cập nhật thất bại!");
          }
        }}
        setLoading={setLoading}
        isClone={false}
      />

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-sm w-full">
          <DialogHeader>
            <DialogTitle>Xác nhận xóa Task</DialogTitle>
          </DialogHeader>
          <div>Bạn có chắc chắn muốn xóa task này không?</div>
          <DialogFooter>
            <Button2
              className="cursor-pointer"
              variant="destructive"
              onClick={async () => {
                if (!detailTask) return;
                const res = await fetch(`/api/tasks`, {
                  method: "DELETE",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ id: detailTask.id }),
                });
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
            </Button2>
            <DialogClose asChild>
              <Button2
                className="cursor-pointer"
                type="button"
                variant="secondary"
                onClick={() => setShowDeleteDialog(false)}
              >
                Hủy
              </Button2>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {loading2 && (
        <div className="fixed inset-0 flex items-center justify-center z-[1000]">
          {/* Material spinner */}
          <svg
            className="animate-spin w-20 h-20 text-blue-500"
            viewBox="22 22 44 44"
          >
            <circle
              className="opacity-20"
              cx="44"
              cy="44"
              r="20.2"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.6"
            />
            <circle
              className="opacity-100"
              cx="44"
              cy="44"
              r="20.2"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.6"
              strokeDasharray="80"
              strokeDashoffset="60"
            />
          </svg>
        </div>
      )}
    </div>
  );
}

// Button component hỗ trợ dark mode
function Button({ children, variant = "ghost", size, ...props }) {
  const { resolvedTheme } = useTheme?.() ?? { resolvedTheme: "light" };
  const isDark = resolvedTheme === "dark";

  const base = "flex items-center justify-center rounded transition-colors";
  const variants = {
    ghost: isDark
      ? "bg-transparent hover:bg-gray-800 text-gray-200"
      : "bg-transparent hover:bg-gray-200",
    outline: isDark
      ? "border border-gray-500 px-3 py-1 text-sm bg-transparent hover:bg-gray-800 text-gray-200"
      : "border border-gray-300 px-3 py-1 text-sm bg-transparent hover:bg-gray-200",
  };
  const sizes = {
    icon: "w-8 h-8",
  };
  return (
    <button
      {...props}
      className={`${base} ${variants[variant]} ${
        size ? sizes[size] : "px-2 py-1"
      }`}
    >
      {children}
    </button>
  );
}
