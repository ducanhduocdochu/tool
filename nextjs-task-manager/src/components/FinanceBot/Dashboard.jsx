"use client"

import React, { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"

export default function Dashboard() {
  const [view, setView] = useState("week")
  const [offset, setOffset] = useState(0)
  const [data, setData] = useState({ dayTotals: [], keywordTotals: [], total: 0 })
  const [keywords, setKeywords] = useState([])

  useEffect(() => {
    fetch('/api/keywords')
      .then(res => res.json())
      .then(setKeywords)
      .catch(() => setKeywords([]))
  }, [])

  useEffect(() => {
    if (keywords.length)
      fetchData()
  }, [view, offset, keywords])

  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const dayColors = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899", "#6366f1"]

  const getRange = () => {
    const now = new Date()
    if (view === "week") {
      const mid = new Date(now)
      mid.setDate(mid.getDate() + offset * 7)
      const day = mid.getDay()
      const monday = new Date(mid)
      monday.setDate(mid.getDate() - ((day + 6) % 7))
      return Array.from({ length: 7 }).map((_, i) => {
        const d = new Date(monday)
        d.setDate(monday.getDate() + i)
        return d
      })
    } else {
      const monthStart = new Date(now.getFullYear(), now.getMonth() + offset, 1)
      const daysInMonth = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0).getDate()
      return Array.from({ length: daysInMonth }).map((_, i) => new Date(monthStart.getFullYear(), monthStart.getMonth(), i + 1))
    }
  }

  async function fetchData() {
    const range = getRange()
    const from = range[0].toISOString()
    const last = new Date(range[range.length - 1])
    last.setHours(23, 59, 59)
    const to = last.toISOString()
    const res = await fetch(
      `/api/transactions?from=${from}&to=${to}&type=expense&pageSize=1000`
    )
    const json = await res.json()
    const txs = json.data || []

    const filteredTxs = txs.filter((tx) => {
      const key = tx.timestamp.slice(0, 10)
      return range.some((d) => d.toISOString().slice(0, 10) === key)
    })

    let dayTotals = []
    if (view === "week") {
      dayTotals = range.map((d) => {
        const key = d.toISOString().slice(0, 10)
        const total = filteredTxs
          .filter((tx) => tx.timestamp.slice(0, 10) === key)
          .reduce((sum, tx) => sum + Math.abs(tx.amount), 0)
        return { date: key, amount: total }
      })
    }

    const byKeyword = {}
    keywords.forEach((kw) => {
      byKeyword[kw.phrase] = 0
    })

    filteredTxs.forEach((tx) => {
      const k = tx.keyword?.phrase || "Unknown"
      if (!(k in byKeyword)) byKeyword[k] = 0
      byKeyword[k] += Math.abs(tx.amount)
    })

    const keywordTotals = Object.entries(byKeyword).map(([name, amount]) => ({ name, amount }))
    const total = filteredTxs.reduce((sum, tx) => sum + Math.abs(tx.amount), 0)

    setData({ dayTotals, keywordTotals, total })
  }

  const range = getRange()
  const titleRange =
    view === "week"
      ? `Week of ${range[0].toLocaleDateString("en-US")} to ${range[6].toLocaleDateString("en-US")}`
      : `Month: ${range[0].toLocaleDateString("en-US", { month: "long", year: "numeric" })}`

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <Button
          size="sm"
          variant={view === "week" ? "default" : "outline"}
          onClick={() => setView("week")}
          className="cursor-pointer"
        >
          Week
        </Button>
        <Button
          size="sm"
          variant={view === "month" ? "default" : "outline"}
          onClick={() => setView("month")}
          className="cursor-pointer"
        >
          Month
        </Button>
      </div>
      <div className="flex justify-between items-center mb-4">
        <span className="font-semibold">{titleRange}</span>
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => setOffset((o) => o - 1)}
            className="cursor-pointer"
          >
            Prev
          </Button>
          <Button
            size="sm"
            onClick={() => setOffset((o) => o + 1)}
            className="cursor-pointer"
          >
            Next
          </Button>
        </div>
      </div>
      <div className="text-lg mb-4">
        Total expense: {new Intl.NumberFormat("en-US").format(data.total)} VND
      </div>

      {view === "week" && (
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Expenses by Day</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.dayTotals} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <XAxis
                    dataKey="date"
                    tickFormatter={(str) => {
                      const d = new Date(str)
                      const idx = d.getDay() === 0 ? 6 : d.getDay() - 1
                      return weekdays[idx]
                    }}
                  />
                  <YAxis tickFormatter={(val) => `${val.toLocaleString("en-US")} VND`} />
                  <Tooltip formatter={(val) => `${val.toLocaleString("en-US")} VND`} />
                  <Bar dataKey="amount">
                    {data.dayTotals.map((entry, idx) => (
                      <Cell key={idx} fill={dayColors[idx]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Expenses by Keyword</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.keywordTotals} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(val) => `${val.toLocaleString("en-US")} VND`} />
                  <Tooltip formatter={(val) => `${val.toLocaleString("en-US")} VND`} />
                  <Bar dataKey="amount" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {view === "month" && (
        <Card>
          <CardHeader>
            <CardTitle>Expenses by Keyword</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.keywordTotals}
                layout="vertical"
                margin={{ left: 80 }}
              >
                <XAxis type="number" tickFormatter={(val) => `${val.toLocaleString("en-US")} VND`} />
                <YAxis dataKey="name" type="category" />
                <Tooltip formatter={(val) => `${val.toLocaleString("en-US")} VND`} />
                <Bar dataKey="amount" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
