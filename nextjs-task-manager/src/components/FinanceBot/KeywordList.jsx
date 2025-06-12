"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { PencilIcon, TrashIcon, PlusIcon, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function KeywordList() {
  const [keywords, setKeywords] = useState([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [editingKeyword, setEditingKeyword] = useState(null)
  const [phrase, setPhrase] = useState("")
  const [type, setType] = useState("expense")
  const [saving, setSaving] = useState(false)

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [keywordToDelete, setKeywordToDelete] = useState(null)

  const fetchKeywords = async () => {
    setLoading(true)
    const res = await fetch("/api/keywords")
    const data = await res.json()
    setKeywords(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchKeywords()
  }, [])

  const resetForm = () => {
    setPhrase("")
    setType("expense")
    setEditingKeyword(null)
  }

  const handleSave = async () => {
    if (!phrase.trim()) return
    setSaving(true)
    const payload = { phrase, type }

    const res = await fetch(
      editingKeyword ? `/api/keywords/${editingKeyword.id}` : "/api/keywords",
      {
        method: editingKeyword ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    )

    if (res.ok) {
      await fetchKeywords()
      setOpen(false)
      resetForm()
    }

    setSaving(false)
  }

  const confirmDelete = (kw) => {
    setKeywordToDelete(kw)
    setConfirmDeleteOpen(true)
  }

  const handleDelete = async () => {
    if (!keywordToDelete) return
    setLoading(true)
    await fetch(`/api/keywords/${keywordToDelete.id}`, { method: "DELETE" })
    await fetchKeywords()
    setConfirmDeleteOpen(false)
    setKeywordToDelete(null)
    setLoading(false)
  }

  const openEdit = (kw) => {
    setEditingKeyword(kw)
    setPhrase(kw.phrase)
    setType(kw.type)
    setOpen(true)
  }

  return (
    <div className="max-w-6xl w-full mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">🔑 Action Keywords</h2>
        <Button className='cursor-pointer' onClick={() => { resetForm(); setOpen(true) }}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Keyword
        </Button>
      </div>

      {loading ? (
        <div className="text-center text-gray-500 py-8">
          <Loader2 className="animate-spin mx-auto mb-2 h-6 w-6" />
          Loading keywords...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {keywords.map((kw) => (
            <Card key={kw.id} className="flex flex-col justify-between shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">{kw.phrase}</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Type:</p>
                  <p className={`text-base font-medium ${kw.type === "income" ? "text-green-600" : "text-red-500"}`}>
                    {kw.type}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button className='cursor-pointer' variant="outline" size="icon" onClick={() => openEdit(kw)}>
                    <PencilIcon className="w-4 h-4" />
                  </Button>
                  <Button className='cursor-pointer' variant="destructive" size="icon" onClick={() => confirmDelete(kw)}>
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {keywords.length === 0 && !loading && (
            <div className="col-span-full text-center text-muted-foreground">
              No keywords found.
            </div>
          )}
        </div>
      )}

      {/* Form Add/Edit */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingKeyword ? "Edit Keyword" : "Create Keyword"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Phrase"
              value={phrase}
              onChange={(e) => setPhrase(e.target.value)}
            />
            <Select  value={type} onValueChange={setType}>
              <SelectTrigger className='cursor-pointer'>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem className='cursor-pointer' value="income">Income</SelectItem>
                <SelectItem className='cursor-pointer' value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex justify-end gap-2 pt-2">
              <DialogClose asChild>
                <Button className='cursor-pointer' variant="outline" disabled={saving}>Cancel</Button>
              </DialogClose>
              <Button className='cursor-pointer' onClick={handleSave} disabled={saving}>
                {saving && <Loader2 className="mr-2 w-4 h-4 animate-spin" />}
                {editingKeyword ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete */}
      <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>❗ Confirm Delete</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete keyword <strong>{keywordToDelete?.phrase}</strong>?
          </p>
          <div className="flex justify-end gap-3 pt-4">
            <DialogClose asChild>
              <Button className='cursor-pointer' variant="outline">Cancel</Button>
            </DialogClose>
            <Button className='cursor-pointer' variant="destructive" onClick={handleDelete} disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
