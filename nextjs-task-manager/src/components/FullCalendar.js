'use client'

import { useState, useEffect } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import './calendar-custom.css'

export default function FullCalendar() {
  const [value, setValue] = useState(new Date())
  const [now, setNow] = useState(new Date())
  const [hasMounted, setHasMounted] = useState(false)

  // Cập nhật đồng hồ theo thời gian thực (cứ mỗi giây)
  useEffect(() => {
    setHasMounted(true)
    const interval = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  // Định dạng ngày và giờ
  const formattedDate = now.toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

  const formattedTime = now.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })

  return (
    <div className="flex flex-col md:flex-row items-stretch gap-[18px] w-full">
      {/* Lịch bên trái */}
      <div className="w-full md:w-[32.5%]">
  <div className="rounded-lg overflow-hidden border">
    <Calendar
      onChange={setValue}
      value={value}
      locale="vi-VN"
      prev2Label="«"
      next2Label="»"
      className="react-calendar"
    />
  </div>
</div>

      {/* Ngày giờ bên phải */}
      <div className="flex-1 md:max-w-[68.5%] bg-card text-card-foreground p-6 rounded-lg shadow flex flex-col justify-center items-center text-center">
        {hasMounted ? (
          <>
            <h2 className="text-6xl font-bold mb-2">{formattedTime}</h2>
            <p className="text-4xl text-muted-foreground">{formattedDate}</p>
          </>
        ) : (
          <p className="text-xl text-muted">Đang tải thời gian...</p>
        )}
      </div>
    </div>
  )
}
