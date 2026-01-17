"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Sidebar } from "./sidebar"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return (
    <div className="flex h-screen w-screen bg-neutral-50 overflow-hidden">
      {/* Sidebar - Desktop visible, mobile in drawer */}
      <div
        className={`
          fixed lg:relative w-64 h-full transition-all duration-300 ease-in-out z-40
          ${sidebarOpen ? "translate-x-0" : isMobile ? "-translate-x-full" : "translate-x-0"}
        `}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} isOpen={sidebarOpen} />
      </div>

      {/* Mobile overlay - only show when sidebar is open on mobile */}
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content - always has proper spacing */}
      <div className="flex-1 flex flex-col w-full overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-20 bg-white border-b border-neutral-200 shadow-sm">
          <div className="flex items-center justify-between px-4 h-16">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h2 className="font-bold text-neutral-900">BikeService CRM</h2>
            <div className="w-10" />
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
