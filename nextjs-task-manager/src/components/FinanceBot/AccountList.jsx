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

export default function AccountList() {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [editingAccount, setEditingAccount] = useState(null)
  const [name, setName] = useState("")
  const [balance, setBalance] = useState("")
  const [saving, setSaving] = useState(false)

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [accountToDelete, setAccountToDelete] = useState(null)

  const fetchAccounts = async () => {
    setLoading(true)
    const res = await fetch("/api/accounts")
    const data = await res.json()
    setAccounts(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchAccounts()
  }, [])

  const resetForm = () => {
    setName("")
    setBalance("")
    setEditingAccount(null)
  }

  const handleSave = async () => {
    if (!name.trim()) return
    setSaving(true)
    const payload = {
      name,
      balance: parseInt(balance) || 0,
    }

    const res = await fetch(
      editingAccount ? `/api/accounts/${editingAccount.id}` : "/api/accounts",
      {
        method: editingAccount ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    )

    if (res.ok) {
      await fetchAccounts()
      setOpen(false)
      resetForm()
    }

    setSaving(false)
  }

  const confirmDelete = (account) => {
    setAccountToDelete(account)
    setConfirmDeleteOpen(true)
  }

  const handleDelete = async () => {
    if (!accountToDelete) return
    setLoading(true)
    await fetch(`/api/accounts/${accountToDelete.id}`, { method: "DELETE" })
    await fetchAccounts()
    setConfirmDeleteOpen(false)
    setAccountToDelete(null)
    setLoading(false)
  }

  const openEdit = (account) => {
    setEditingAccount(account)
    setName(account.name)
    setBalance(account.balance.toString())
    setOpen(true)
  }

  return (
    <div className="max-w-6xl w-full mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">💰 Accounts Overview</h2>
        <Button className="cursor-pointer" onClick={() => { resetForm(); setOpen(true) }}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Account
        </Button>
      </div>

      {loading ? (
        <div className="text-center text-gray-500 py-8">
          <Loader2 className="animate-spin mx-auto mb-2 h-6 w-6" />
          Loading accounts...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {accounts.map((acc) => (
            <Card key={acc.id} className="flex flex-col justify-between shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">{acc.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Balance:</p>
                  <p className="text-xl font-bold text-green-600 dark:text-green-400">
                    {acc.balance.toLocaleString()} VND
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={() => openEdit(acc)}>
                    <PencilIcon className="w-4 h-4" />
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => confirmDelete(acc)}>
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {accounts.length === 0 && !loading && (
            <div className="col-span-full text-center text-muted-foreground">
              No accounts found.
            </div>
          )}
        </div>
      )}

      {/* Form Add/Edit */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingAccount ? "Edit Account" : "Create Account"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Account name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              placeholder="Balance"
              type="number"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
            />
            <div className="flex justify-end gap-2 pt-2">
              <DialogClose asChild>
                <Button variant="outline" disabled={saving}>Cancel</Button>
              </DialogClose>
              <Button onClick={handleSave} disabled={saving}>
                {saving && <Loader2 className="mr-2 w-4 h-4 animate-spin" />}
                {editingAccount ? "Update" : "Create"}
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
            Are you sure you want to delete account <strong>{accountToDelete?.name}</strong>?
          </p>
          <div className="flex justify-end gap-3 pt-4">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDelete} disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
