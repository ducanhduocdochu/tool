'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function PlanListPage() {
  const [plans, setPlans] = useState([])

  useEffect(() => {
    fetch('/api/plans')
      .then(res => res.json())
      .then(setPlans)
  }, [])

  const createPlan = async () => {
    const res = await fetch('/api/plans', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: `New Plan ${Date.now()}` })
    })
    const newPlan = await res.json()
    window.location.href = `/plans/${newPlan.id}`
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📋 Plans</h1>

      <ul className="space-y-2">
        {plans.map(plan => (
          <li key={plan.id}>
            <Link href={`/plans/${plan.id}`}>
              <span className="text-white dark:text-black underline hover:text-blue-800">{plan.name}</span>
            </Link>
          </li>
        ))}
      </ul>

      <button
        onClick={createPlan}
        className="mt-6 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        ➕ Create new plan
      </button>
    </div>
  )
}
