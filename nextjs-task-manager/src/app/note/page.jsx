"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow, isPast, differenceInMinutes } from "date-fns";

export default function NotePage() {
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({
    id: null,
    title: "",
    content: "",
    dueAt: "",
  });

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await fetch("/api/notes");
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setNotes(data);
    } catch (error) {
      console.error("Failed to fetch notes:", error);
      setNotes([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        action: form.id ? "update" : "create",
      }),
    });

    await res.json();
    setForm({ id: null, title: "", content: "", dueAt: "" });
    fetchNotes();
  };

  const handleEdit = (note) => {
    setForm({
      id: note.id,
      title: note.title,
      content: note.content,
      dueAt: note.dueAt?.slice(0, 16) || "", // datetime-local format
    });
  };

  const handleDelete = async (id) => {
    await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", id }),
    });
    fetchNotes();
  };

  const getTitleColor = (dueAt) => {
    if (!dueAt) return "";
    const due = new Date(dueAt);
    if (isPast(due)) return "text-red-500";
    if (differenceInMinutes(due, new Date()) <= 60) return "text-orange-500";
    return "";
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <Textarea
          placeholder="Content"
          rows={4}
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
        />
        <Input
          type="datetime-local"
          value={form.dueAt}
          onChange={(e) => setForm({ ...form, dueAt: e.target.value })}
        />
        <Button type="submit">{form.id ? "Update" : "Add"} Note</Button>
      </form>

      <div className="space-y-4">
        {notes.map((note) => (
          <Card key={note.id}>
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <CardTitle
                  className={`text-base sm:text-lg ${getTitleColor(
                    note.dueAt
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
              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleEdit(note)}>
                  Update
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(note.id)}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
