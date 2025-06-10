'use client'
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null

  // Lấy ra condition từ payload[0].payload
  const { condition } = payload[0].payload

  return (
    <div className="bg-white p-2 rounded shadow-lg text-sm">
      <p className="font-medium mb-1">{label}</p>
      <p className="italic mb-1">Điều kiện: {condition}</p>
      {payload.map((entry, idx) => (
        <p key={idx} style={{ color: entry.color }}>
          {entry.name}: {entry.value}
          {entry.dataKey === 'temp' ? '°C' : '%'}
        </p>
      ))}
    </div>
  )
}

export default function WeatherHourModal({ day, onClose }) {
  if (!day) return null

  const dateObj = new Date(day.date)
  const dateStr = dateObj.toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
  })

  // Mở rộng chartData
  const chartData = day.hour.map((h) => ({
    hour: `${new Date(h.time).getHours()}h`,
    temp: h.temp_c,
    uv: h.uv,
    rainChance: h.chance_of_rain,
    humidity: h.humidity,
    condition: h.condition.text,
  }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Modal Content */}
      <div
        className="relative z-10 bg-card text-card-foreground rounded-xl p-6 w-full max-w-3xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 text-xl font-bold px-3 py-1 rounded hover:bg-muted"
          onClick={onClose}
        >
          ×
        </button>
        <h3 className="text-xl font-semibold mb-4">
          {dateStr} – {day.day.condition.text}
        </h3>

        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart
            data={chartData}
            margin={{ top: 10, right: 30, bottom: 10, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis
              yAxisId="left"
              label={{ value: '°C', angle: -90, position: 'insideLeft' }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              label={{ value: '%', angle: 90, position: 'insideRight' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />

            {/* Cột nhiệt độ */}
            <Bar
              yAxisId="left"
              dataKey="temp"
              name="Nhiệt độ (°C)"
              fill="#34d399"
              barSize={16}
            />

            {/* Đường UV */}
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="uv"
              name="Chỉ số UV"
              stroke="#facc15"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 6 }}
            />

            {/* Đường khả năng mưa */}
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="rainChance"
              name="Khả năng mưa (%)"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 6 }}
            />

            {/* Đường độ ẩm */}
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="humidity"
              name="Độ ẩm (%)"
              stroke="#f87171"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 6 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
