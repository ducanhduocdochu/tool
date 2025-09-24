"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow, subHours } from "date-fns";
import OneMinuteDatetimePicker from "@/components/ui/pickerdatedefault";
import LoginForm from "@/components/LoginForm";

export default function NotePage() {
  // const [authenticated, setAuthenticated] = useState(false);

  // useEffect(() => {
  //   fetch("/api/auth/check")
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setAuthenticated(data.authenticated);
  //     });
  // }, []);

  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({
    id: null,
    title: "",
    content: "",
    dueAt: toLocalISOString(),
    warningHours: 2,
    dangerHours: 0.5,
  });

  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await fetch("/api/notes");
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      console.log(data);
      setNotes(data);
    } catch (error) {
      console.error("Failed to fetch notes:", error);
      setNotes([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.dueAt) {
      alert("Please select a due date and time.");
      return;
    }

    setLoading(true);
    try {
      await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          warningHours: parseFloat(form.warningHours),
          dangerHours: parseFloat(form.dangerHours),
          action: form.id ? "update" : "create",
        }),
      });

      setForm({
        id: null,
        title: "",
        content: "",
        dueAt: toLocalISOString(),
        warningHours: 2,
        dangerHours: 1,
      });
      await fetchNotes();
    } catch (error) {
      console.error("Failed to submit note:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (note) => {
    setForm({
      id: note.id,
      title: note.title,
      content: note.content,
      dueAt: toLocalISOString(),
      warningHours: note.warningHours ?? 2,
      dangerHours: note.dangerHours ?? 0.5,
    });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this note?"
    );
    if (!confirmDelete) return;

    setDeletingId(id);
    try {
      await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id }),
      });
      await fetchNotes();
    } catch (error) {
      console.error("Failed to delete note:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const getNoteStatusColor = (note) => {
    if (!note.dueAt) return "border-gray-200";
    const due = new Date(note.dueAt);
    const now = new Date();

    const dangerHours = parseFloat(note.dangerHours ?? 0.5);
    const warningHours = parseFloat(note.warningHours ?? 2);

    const dangerTime = subHours(due, dangerHours);
    const warningTime = subHours(due, warningHours);

    if (now >= due) return "border-red-600"; // quá hạn
    if (now >= dangerTime) return "border-red-400"; // cảnh báo đỏ
    if (now >= warningTime) return "border-yellow-400"; // cảnh báo vàng
    return "border-green-500"; // bình thường – màu xanh lá
  };

  function toLocalISOString(date = new Date()) {
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60000);
    return localDate.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:mm"
  }

  const getTitleColor = (note) => {
    if (!note.dueAt) return "";
    const due = new Date(note.dueAt);
    const now = new Date();
    const dangerTime = subHours(due, note.dangerHours);
    const warningTime = subHours(due, note.warningHours);

    if (now >= due) return "text-red-500";
    if (now >= dangerTime) return "text-red-400";
    if (now >= warningTime) return "text-orange-500";
    return "";
  };
  // if (!authenticated) {
  //   return <LoginForm onLogin={() => setAuthenticated(true)} />;
  // }
  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex flex-col lg:flex-row justify-between">
        <div className="mr-10 w-full lg:w-1/2">
          <form onSubmit={handleSubmit} className="space-y-4 w-full">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <Input
                placeholder="Enter title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Amount `VND`
              </label>
              <Textarea
                placeholder="Enter amount `VND`"
                rows={4}
                type="number"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                disabled={loading}
              />
            </div>

            {/* <div>
              <label className="block text-sm font-medium mb-1">Due At</label>
              <OneMinuteDatetimePicker
                value={form.dueAt}
                onChange={(v) => setForm({ ...form, dueAt: v })}
              />
            </div> */}

            {/* <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">
                  Warning Hours
                </label>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  value={form.warningHours}
                  onChange={(e) =>
                    setForm({ ...form, warningHours: e.target.value })
                  }
                  disabled={loading}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">
                  Danger Hours
                </label>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  value={form.dangerHours}
                  onChange={(e) =>
                    setForm({ ...form, dangerHours: e.target.value })
                  }
                  disabled={loading}
                />
              </div>
            </div> */}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Saving..." : form.id ? "Update" : "Add"} Note
            </Button>
          </form>
        </div>
        <div className="w-full lg:w-1/2">
          <div className="space-y-4 w-full mt-10">
            {notes.map((note) => (
              <Card
                key={note.id}
                className={`w-full border-2 ${getNoteStatusColor(note)} ${
                  new Date() >= new Date(note.dueAt) ? "blinking-card" : ""
                }`}
              >
                <CardHeader className="pb-2">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <CardTitle
                      className={`text-base sm:text-lg font-semibold ${getNoteStatusColor(
                        note
                      )}`}
                    >
                      {note.title}
                    </CardTitle>
                    {note.dueAt && (
                      <p className="text-sm text-muted-foreground mt-1 sm:mt-0 sm:ml-4">
                        ⏰{" "}
                        {formatDistanceToNow(new Date(note.dueAt), {
                          addSuffix: true,
                        })}
                      </p>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-3 whitespace-pre-line">{note.content}</p>

                  {note.dueAt && (
                    <p className="text-sm text-black mb-2 dark:text-white">
                      📅 Due at:{" "}
                      {new Date(note.dueAt).toLocaleString("vi-VN", {
                        hour12: false,
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  )}

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleEdit(note)}
                      disabled={loading}
                    >
                      Update
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(note.id)}
                      disabled={deletingId === note.id}
                    >
                      {deletingId === note.id ? "Deleting..." : "Delete"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
