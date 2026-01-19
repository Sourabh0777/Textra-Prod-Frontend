"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Sidebar } from "./sidebar";
import { Navbar } from "./navbar";
import { useFetchUserData } from "@/lib/hooks/useFetchUserData";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Fetch user data and store in Redux
  useFetchUserData();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
      {sidebarOpen && isMobile && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main content - always has proper spacing */}
      <div className="flex-1 flex flex-col w-full overflow-hidden relative">
        {/* Global Sticky Navbar */}
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} isMobile={isMobile} />

        {/* Main content area */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
