import './globals.css'
import Sidebar from '../components/Sidebar'
import { Providers } from './providers'
import ThemeToggle from '@/components/ToggerTheme'

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          {/* Nút chuyển theme lơ lửng */}
          <ThemeToggle />

          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 p-6">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  )
}
