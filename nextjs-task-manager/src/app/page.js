'use client'

import { useEffect, useState } from 'react'
import {
  CheckCircledIcon,
  FileTextIcon,
  EnvelopeOpenIcon,
  PersonIcon,
  BackpackIcon,
} from '@radix-ui/react-icons'
import FullCalendar from '@/components/FullCalendar'
import WeatherHourModal from '@/components/WeatherHourModal'

export default function Home() {
  const [dateStr, setDateStr] = useState('')
  const [weather, setWeather] = useState(null)
  const [forecast, setForecast] = useState([])
  const [selectedDay, setSelectedDay] = useState(null)

  useEffect(() => {
    const now = new Date()
    const formatter = new Intl.DateTimeFormat('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    setDateStr(formatter.format(now))
  }, [])

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords
      try {
        const res = await fetch(
          `https://api.weatherapi.com/v1/forecast.json?key=ec83afa14b1f470b8be33458251006&q=${latitude},${longitude}&days=7&lang=vi`
        )
        const data = await res.json()

        console.log(data)

        if (data?.current && data?.location && data?.forecast?.forecastday) {
          setWeather({
            temp: Math.round(data.current.temp_c),
            city: data.location.name,
            desc: data.current.condition.text,
            icon: data.current.condition.icon,
            uv: data.current.uv,
          })
          setForecast(data.forecast.forecastday)
        } else {
          console.warn('WeatherAPI trả về lỗi:', data)
        }
      } catch (error) {
        console.error('Lỗi khi lấy thời tiết:', error)
      }
    })
  }, [])

  return (
    <section className="p-6 space-y-6 bg-background text-foreground">
      <div>
        <h1 className="text-2xl font-bold mb-6">
          👋 Chào mừng trở lại, <span className="text-3xl text-green-600 dark:text-green-400">Đức Anh</span> !!!
        </h1>

        {weather && (
          <div className='mb-4'>
            <div className="flex items-center gap-4 bg-card text-card-foreground rounded-lg p-4 shadow-sm">
              <img src={weather.icon} alt="Weather Icon" className="w-12 h-12" />

              <div>
                <p className="text-4xl font-bold text-foreground leading-tight">
                  {weather.temp}°C
                </p>
                <div className="text-sm text-muted-foreground">
                  <p>{weather.desc}</p>
                  <p>{weather.city} | ☀ UV: {weather.uv}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        <FullCalendar />

      </div>

      <div className="bg-card rounded-lg p-4 border shadow-sm">
        <h2 className="text-lg font-semibold mb-2">📈 Tiến độ hôm nay</h2>
        <div className="w-full bg-muted rounded-full h-4 mb-2">
          <div className="bg-green-500 h-4 rounded-full" style={{ width: '65%' }}></div>
        </div>
        <p className="text-sm text-muted-foreground">Hoàn thành 3 / 5 công việc</p>
      </div>

      <div className="bg-card rounded-lg p-4 border shadow-sm">
        <h2 className="text-lg font-semibold mb-2">🕒 Lịch trình gần nhất</h2>
        <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
          <li>09:00 - Họp nhóm dự án A</li>
          <li>14:00 - Viết bài Note cho Tool B</li>
          <li>17:30 - Check email khách hàng</li>
        </ul>
      </div>

      <div className="bg-card rounded-lg p-4 border shadow-sm">
        <h2 className="text-lg font-semibold mb-2">📊 Thống kê nhanh</h2>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>🔖 12 task trong tuần này</li>
          <li>🗒 8 note được ghi</li>
          <li>📬 35 email đã nhận</li>
        </ul>
      </div>

      {/* Dự báo thời tiết 7 ngày */}
            {forecast.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mt-6 mb-2">Dự báo 7 ngày tới</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {forecast.map((day) => {
              const dateObj = new Date(day.date)
              const formatter = new Intl.DateTimeFormat('vi-VN', {
                weekday: 'long',
                day: '2-digit',
                month: '2-digit',
              })
              const formattedDate = formatter.format(dateObj)

              return (
                <button
                  key={day.date}
                  className="hover:cursor-pointer flex items-center gap-4 border rounded-lg p-3 bg-card text-card-foreground shadow-sm w-full text-left transition hover:ring-2 hover:ring-green-400"
                  onClick={() => setSelectedDay(day)}
                >
                  <img
                    src={day.day.condition.icon}
                    alt={day.day.condition.text}
                    className="w-10 h-10"
                  />
                  <div className="flex-1">
                    <p className="font-medium capitalize">{formattedDate}</p>
                    <p className="text-sm text-muted-foreground">{day.day.condition.text}</p>
                    <p className="text-sm">
                      🌡 {day.day.mintemp_c}° ~ {day.day.maxtemp_c}°C | ☀ UV: {day.day.uv}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
          <WeatherHourModal day={selectedDay} onClose={() => setSelectedDay(null)} />
        </div>
      )}


      {/* Dashboard */}
      <h2 className="text-xl font-semibold mt-6 mb-2">Các chức năng chính</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card icon={<CheckCircledIcon className="w-5 h-5 text-green-500" />} title="Tasks" description="5 công việc đang làm" />
        <Card icon={<FileTextIcon className="w-5 h-5 text-blue-500" />} title="Notes" description="3 ghi chú gần đây" />
        <Card icon={<EnvelopeOpenIcon className="w-5 h-5 text-red-500" />} title="Mail" description="12 email chưa đọc" />
        <Card icon={<PersonIcon className="w-5 h-5 text-purple-500" />} title="Accounts" description="8 tài khoản đang dùng" />
        <Card icon={<BackpackIcon className="w-5 h-5 text-yellow-500" />} title="Portfolio" description="2 dự án đang hoạt động" />
      </div>


    </section>
  )
}

function Card({ icon, title, description }) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-lg bg-card text-card-foreground border border-muted shadow-sm hover:shadow-md transition">
      <div className="mt-1">{icon}</div>
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}
