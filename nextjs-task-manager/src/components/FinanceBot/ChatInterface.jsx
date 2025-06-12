"use client"

import { useEffect, useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2 } from "lucide-react"

export default function ChatInterface() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [botTyping, setBotTyping] = useState(false)
  const [typedBotText, setTypedBotText] = useState("")
  const [pendingBotReply, setPendingBotReply] = useState("")
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, typedBotText])

  useEffect(() => {
    if (pendingBotReply && botTyping) {
      let index = 0
      const interval = setInterval(() => {
        setTypedBotText(pendingBotReply.slice(0, index + 1))
        index++
        if (index >= pendingBotReply.length) {
          clearInterval(interval)
          setMessages(prev => [...prev, { from: "bot", text: pendingBotReply }])
          setPendingBotReply("")
          setTypedBotText("")
          setBotTyping(false)
        }
      }, 30) // tốc độ gõ: càng nhỏ càng nhanh

      return () => clearInterval(interval)
    }
  }, [pendingBotReply, botTyping])

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/finance/chat", { method: "GET" })
      const data = await res.json()
      setMessages(data)
    } catch {
      setMessages([{ from: "bot", text: "⚠️ Không thể tải lịch sử chat." }])
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  const sendMessage = async () => {
    if (!input.trim()) return
    const userMessage = input.trim()

    setMessages(prev => [...prev, { from: "user", text: userMessage }])
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("/api/finance/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      })

      const data = await res.json()
      const reply = data.reply || "🤖 Không hiểu yêu cầu."
      setPendingBotReply(reply)
      setBotTyping(true)
    } catch {
      setMessages(prev => [...prev, { from: "bot", text: "❌ Có lỗi xảy ra." }])
    }

    setLoading(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage()
  }

  return (
    <Card className="max-w-6xl w-full mx-auto p-4 h-[85vh] flex flex-col shadow-lg">
      <ScrollArea className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.length === 0 && !loading && (
          <div className="text-center text-gray-400 py-4">
            Empty hihi
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`rounded-lg px-4 py-2 text-sm max-w-[75%] whitespace-pre-wrap
                ${msg.from === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-zinc-800 text-gray-900 dark:text-gray-100"}`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {botTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-200 dark:bg-zinc-800 text-gray-900 dark:text-gray-100 px-4 py-2 rounded-lg text-sm max-w-[75%] whitespace-pre-wrap">
              {typedBotText}
              <span className="animate-pulse">|</span>
            </div>
          </div>
        )}

        <div ref={endRef} />
      </ScrollArea>

      <div className="mt-4 flex gap-2">
        <Input
          className="flex-1 text-base h-12"
          placeholder="💬 Nhập tin nhắn..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading || botTyping}
        />
        <Button className="h-12 px-6 text-base" onClick={sendMessage} disabled={loading || botTyping}>
          {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Gửi"}
        </Button>
      </div>
    </Card>
  )
}
