'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  HomeIcon,
  BackpackIcon,
  CheckCircledIcon,
  PersonIcon,
  FileTextIcon,
  EnvelopeOpenIcon,
  ChatBubbleIcon,
  GearIcon
} from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

const menu = [
  { title: 'Home', path: '/', icon: <HomeIcon className="w-4 h-4 mr-2" /> },
  { title: 'Portfolio', path: '/portfolio', icon: <BackpackIcon className="w-4 h-4 mr-2" /> },
  { title: 'Tasks', path: '/tasks', icon: <CheckCircledIcon className="w-4 h-4 mr-2" /> },
  { title: 'Account', path: '/account', icon: <PersonIcon className="w-4 h-4 mr-2" /> },
  { title: 'Note', path: '/note', icon: <FileTextIcon className="w-4 h-4 mr-2" /> },
  { title: 'Mail', path: '/mail', icon: <EnvelopeOpenIcon className="w-4 h-4 mr-2" /> },
  {
    title: 'FinanceBot',
    path: '/finance-bot',
    icon: <ChatBubbleIcon className="w-4 h-4 mr-2" />,
  },
  {
    title: 'Setting',
    path: '/setting',
    icon: <GearIcon className="w-4 h-4 mr-2" />,
  }
]

export default function Sidebar() {
  const pathname = usePathname()
  const activeIndex = menu.findIndex((item) => item.path === pathname)
  const itemHeight = 48

  return (
    <aside className="fixed left-0 top-0 w-64 h-screen bg-muted p-4 border-r dark:border-gray-700 dark:bg-gray-900">
      <div className="relative">
        {/* Thanh xanh chỉ mục */}
        {activeIndex !== -1 && (
          <motion.div
            className="absolute right-0 w-1 h-12 bg-green-500 rounded-l z-10"
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
        </ul>
      </div>
    </aside>
  )
}
