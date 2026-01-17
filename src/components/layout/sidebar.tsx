"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

interface SidebarProps {
  onClose?: () => void
  isOpen?: boolean
}

const menuItems = [
  { label: "Dashboard", href: "/", icon: "📊" },
  { label: "Businesses", href: "/businesses", icon: "🏢" },
  { label: "Customers", href: "/customers", icon: "👥" },
  { label: "Vehicles", href: "/vehicles", icon: "🚗" },
  { label: "Services", href: "/services", icon: "🔧" },
  { label: "Reminders", href: "/reminders", icon: "⏰" },
  { label: "WhatsApp Logs", href: "/whatsapp-logs", icon: "💬" },
]

export function Sidebar({ onClose, isOpen }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="w-full h-full bg-gradient-to-b from-neutral-900 via-neutral-800 to-neutral-900 text-white overflow-y-auto flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-neutral-700/50 bg-neutral-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center font-bold text-lg">
            BS
          </div>
          <div>
            <h1 className="text-xl font-bold leading-tight">BikeService</h1>
            <p className="text-neutral-400 text-xs">CRM</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group
                ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/50"
                    : "text-neutral-300 hover:bg-neutral-700/50 hover:text-white"
                }
              `}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium text-sm">{item.label}</span>
              {isActive && <div className="ml-auto w-2 h-2 bg-blue-300 rounded-full animate-pulse" />}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-neutral-700/50 bg-neutral-900/80 backdrop-blur-sm">
        <div className="text-xs text-neutral-400 text-center">
          <p>Service Management</p>
          <p className="mt-1">v1.0.0</p>
        </div>
      </div>
    </aside>
  )
}
