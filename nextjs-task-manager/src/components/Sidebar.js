'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  HomeIcon,
  BackpackIcon,
  CheckCircledIcon,
  PersonIcon,
  FileTextIcon,
  EnvelopeOpenIcon,
  ChatBubbleIcon,
  GearIcon,
  PlusCircledIcon,
  CalendarIcon
} from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

const menu = [
  { title: 'Home', path: '/', icon: <HomeIcon className="w-4 h-4 mr-2" /> },
  { title: 'Portfolio', path: '/portfolio', icon: <BackpackIcon className="w-4 h-4 mr-2" /> },
  { title: 'Tasks', path: '/tasks', icon: <CheckCircledIcon className="w-4 h-4 mr-2" /> },
  { title: 'Account', path: '/account', icon: <PersonIcon className="w-4 h-4 mr-2" /> },
  { title: 'Note', path: '/note', icon: <FileTextIcon className="w-4 h-4 mr-2" /> },
  { title: 'Mail', path: '/mail', icon: <EnvelopeOpenIcon className="w-4 h-4 mr-2" /> },
  { title: 'FinanceBot', path: '/finance-bot', icon: <ChatBubbleIcon className="w-4 h-4 mr-2" /> },
  { title: 'Setting', path: '/setting', icon: <GearIcon className="w-4 h-4 mr-2" /> }
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [showPlans, setShowPlans] = useState(false)
  const [plans, setPlans] = useState([])
  const itemHeight = 48

  const allItems = [...menu, ...(showPlans ? plans.map(plan => ({
    title: plan.name,
    path: `/plans/${plan.id}`,
  })) : [])]

  const activeIndex = allItems.findIndex((item) =>
    pathname === item.path || (pathname.startsWith('/plans/') && item.path.startsWith('/plans/'))
  )

  useEffect(() => {
    fetch('/api/plans')
      .then(res => res.json())
      .then(setPlans)
  }, [])

  const handleAddPlan = async () => {
    const res = await fetch('/api/plans', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: `New Plan ${Date.now()}` })
    })
    const newPlan = await res.json()
    router.push(`/plans/${newPlan.id}`)
  }

  return (
    <aside className="fixed left-0 top-0 w-64 h-screen bg-muted p-4 border-r dark:border-gray-700 dark:bg-gray-900 overflow-y-auto">
      <div className="relative">
        {/* Thanh chỉ mục màu xanh */}
        {activeIndex !== -1 && (
          <motion.div
            className={pathname.startsWith('/plans') ? 'absolute right-0 bottom-[100px] w-1 h-12 bg-green-500 rounded-l z-10' : 'absolute right-0 w-1 h-12 bg-green-500 rounded-l z-10'}
            initial={false}
            animate={{ top: activeIndex * itemHeight }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        )}

        <ul>
          {menu.map((item) => {
            const isActive = pathname === item.path
            return (
              <li key={item.path} className="relative h-12">
                <Link href={item.path}>
                  <Button
                    variant="ghost"
                    className={`relative z-0 w-full justify-start h-full pl-4 pr-2 text-left transition-colors duration-200 ${isActive
                      ? 'text-foreground font-semibold bg-white dark:bg-gray-800'
                      : 'text-muted-foreground hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                  >
                    {item.icon}
                    {item.title}
                  </Button>
                </Link>
              </li>
            )
          })}

          {/* --- PLAN MENU --- */}
          <li className="relative">
            <Button
              variant="ghost"
              onClick={() => setShowPlans(!showPlans)}
              className="w-full justify-start h-12 pl-4 pr-2 text-left text-muted-foreground hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <CalendarIcon className="w-4 h-4 mr-2" />
              Plan
            </Button>

            <AnimatePresence initial={false}>
              {showPlans && (
                <motion.ul
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="ml-6 overflow-hidden"
                >
                  {plans.map((plan) => (
                    <li key={plan.id} className="h-12">
                      <Link href={`/plans/${plan.id}`}>
                        <Button
                          variant="ghost"
                          className={`w-full justify-start text-sm text-muted-foreground hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 ${pathname === `/plans/${plan.id}` ? 'font-semibold text-foreground' : ''}`}
                        >
                          {plan.status === 'COMPLETED' && (
          <span className="text-green-500 mr-1">✅</span>
        )}

                          {plan.name}
                        </Button>
                      </Link>
                    </li>
                  ))}
                  <li className="h-10">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-sm text-green-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={handleAddPlan}
                    >
                      <PlusCircledIcon className="w-4 h-4 mr-1" />
                      Add Plan
                    </Button>
                  </li>
                </motion.ul>
              )}
            </AnimatePresence>
          </li>
        </ul>
      </div>
    </aside>
  )
}
