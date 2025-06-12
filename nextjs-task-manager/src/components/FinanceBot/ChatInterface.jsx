"use client"

import { useEffect, useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CheckCircle, Loader2, Share2 } from "lucide-react"

export default function ChatInterface() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [botTyping, setBotTyping] = useState(false)
  const [typedBotText, setTypedBotText] = useState("")
  const [pendingBotReply, setPendingBotReply] = useState("")
  const [pendingBotType, setPendingBotType] = useState(null)
  const [pendingBotValue, setPendingBotValue] = useState(null)
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
          // push the full bot message, including type & value
          setMessages(prev => [
            ...prev,
            {
              from: "bot",
              text: pendingBotReply,
              type: pendingBotType,
              value: pendingBotValue,
            }
          ])
          setPendingBotReply("")
          setPendingBotType(null)
          setPendingBotValue(null)
          setTypedBotText("")
          setBotTyping(false)
        }
      }, 30)

      return () => clearInterval(interval)
    }
  }, [pendingBotReply, botTyping, pendingBotType, pendingBotValue])

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
      setPendingBotType(data.type)
      setPendingBotValue(data.value)
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
      <ScrollArea className="flex-1 overflow-y-hidden space-y-4 pr-2">
        {messages.length === 0 && !loading && (
          <div className="text-center text-gray-400 py-4">Empty hihi</div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"} mb-2`}
          >
            <div>
              <div
                className={`rounded-lg px-4 py-2 text-sm max-w-[75%] whitespace-pre-wrap
                  ${msg.from === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 dark:bg-zinc-800 text-gray-900 dark:text-gray-100"}`}
              >
                {msg.text}
              </div>

              {/* Nếu bot và có type+value, hiển thị khung tiền */}
{msg.from === "bot" && msg.type && typeof msg.value === "number" && (
  <div className="mt-3">
    <div
      className={`
        bg-gray-200 dark:bg-zinc-800 text-white rounded-2xl shadow-lg px-2 py-5 text-center
        w-full max-w-sm
      `}
    >

      {/* số tiền + dấu, dấu màu đỏ/xanh */}
      <CheckCircle className="mx-auto mb-2 text-black dark:text-white w-8 h-8" />
      <div className="text-3xl font-bold mb-3 flex items-baseline justify-center space-x-2">
        <span
          className={
            msg.type === "expense"
              ? "text-red-500"   // màu đỏ cho trừ
              : "text-green-500" // màu xanh cho cộng
          }
        >
          {msg.type === "expense" ? "−" : "+"}
        </span>
        <span className={
            msg.type === "expense"
              ? "text-red-500"   // màu đỏ cho trừ
              : "text-green-500" // màu xanh cho cộng
          }>
          {new Intl.NumberFormat("vi-VN").format(Math.abs(msg.value))} VND
        </span>
      </div>
    </div>
  </div>
)}


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
        <Button className="h-12 px-6 text-base cursor-pointer" onClick={sendMessage} disabled={loading || botTyping}>
          {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Gửi"}
        </Button>
      </div>
    </Card>
  )
}
