import { useState } from "react"

function pad(n) {
  return n.toString().padStart(2, "0");
}

export default function TenMinuteDatetimePicker({ value, onChange, label, className }) {
  // value dạng "YYYY-MM-DDTHH:mm"
  const [date, setDate] = useState(
    value ? value.split("T")[0] : new Date().toISOString().slice(0, 10)
  );
  const [hour, setHour] = useState(
    value ? value.split("T")[1]?.split(":")[0] : pad(new Date().getHours())
  );
  const [minute, setMinute] = useState(
    value ? pad(Math.floor(parseInt(value.split("T")[1]?.split(":")[1] || "0") / 10) * 10) : pad(Math.floor(new Date().getMinutes() / 10) * 10)
  );

  // Khi thay đổi bất kỳ trường nào
  const handleChange = (newDate, newHour, newMinute) => {
    const v = `${newDate}T${pad(newHour)}:${pad(newMinute)}`;
    onChange(v);
  };

  // Render
  return (
    <div className={className}>
      {label && <div className="mb-1 font-semibold">{label}</div>}
      <div className="flex gap-2 items-center">
        {/* Ngày */}
        <input
          type="date"
          value={date}
          onChange={e => {
            setDate(e.target.value);
            handleChange(e.target.value, hour, minute);
          }}
          className="border rounded px-2 py-1"
        />
        {/* Giờ */}
        <select
          value={hour}
          onChange={e => {
            setHour(e.target.value);
            handleChange(date, e.target.value, minute);
          }}
          className="border rounded px-2 py-1"
        >
          {Array.from({ length: 24 }).map((_, h) => (
            <option className="text-black" key={h} value={pad(h)}>
              {pad(h)}
            </option>
          ))}
        </select>
        :
        {/* Phút */}
        <select
          value={minute}
          onChange={e => {
            setMinute(e.target.value);
            handleChange(date, hour, e.target.value);
          }}
          className="border rounded px-2 py-1"
        >
          {["00", "10", "20", "30", "40", "50"].map(m => (
            <option className="text-black" key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>
    </div>
  );
}