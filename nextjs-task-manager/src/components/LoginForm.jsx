import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = async () => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    const result = await res.json()

    if (res.ok) {
      onLogin?.()
    } else {
      setError(result.message || "Login failed")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-900 transition-colors">
      <div className="w-full max-w-md p-8 bg-white dark:bg-zinc-800 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6 dark:text-white">
          Sign in
        </h2>

        <div className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="text-base"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="text-base"
          />
          {error && <p className="text-sm text-red-500">{error}</p>}


          <Button onClick={handleLogin} className="w-full text-base py-1 text-white dark:text-black">
            Login
          </Button>
        </div>
      </div>
    </div>
  )
}
