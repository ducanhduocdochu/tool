"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { MoonIcon, SunIcon } from "@radix-ui/react-icons"
import LoginForm from "@/components/LoginForm"

export default function SettingPage() {
  const [hasPassword, setHasPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState("")
  const { theme, setTheme } = useTheme()
    const [authenticated, setAuthenticated] = useState(false);
  
    useEffect(() => {
      fetch("/api/auth/check")
        .then((res) => res.json())
        .then((data) => {
          setAuthenticated(data.authenticated);
        });
    }, []);
  


  useEffect(() => {
    fetch("/api/auth/check-exist")
      .then((res) => res.json())
      .then((data) => setHasPassword(data.hasPassword))
  }, [])

const handleSubmit = async () => {
  if (!email) return setMessage("❌ Email is required")
  if (!newPassword || newPassword.length < 6) return setMessage("❌ New password must be at least 6 characters")
  if (newPassword !== confirmPassword) return setMessage("❌ Passwords do not match")

  const body = hasPassword
    ? { email, oldPassword, newPassword }
    : { email, newPassword }

  const endpoint = hasPassword ? "/api/auth/update-password" : "/api/auth/set-password"

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    let result = {}
    try {
      result = await res.json()
    } catch (e) {
      result = { message: "Invalid JSON response from server" }
    }

    if (res.ok) {
      setMessage("✅ Password updated successfully")
      setOldPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } else {
      setMessage("❌ " + result.message)
    }
  } catch (err) {
    setMessage("❌ Failed to send request: " + err.message)
  }
}
    if (!authenticated) {
      return <LoginForm onLogin={() => setAuthenticated(true)} />;
    }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 rounded shadow bg-white dark:bg-zinc-900 dark:text-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Password Settings</h2>
      </div>

      <label className="text-sm">Email</label>
      <Input
        type="email"
        className="mb-4"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {hasPassword && (
        <>
          <label className="text-sm">Current Password</label>
          <Input
            type="password"
            className="mb-4"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </>
      )}

      <label className="text-sm">New Password</label>
      <Input
        type="password"
        className="mb-4"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />

      <label className="text-sm">Confirm New Password</label>
      <Input
        type="password"
        className="mb-4"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <Button onClick={handleSubmit} className="w-full">
        {hasPassword ? "Update Password" : "Create Password"}
      </Button>

      {message && <p className="mt-4 text-sm">{message}</p>}
    </div>
  )
}
