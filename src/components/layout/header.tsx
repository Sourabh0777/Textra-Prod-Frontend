"use client"

interface HeaderProps {
  title: string
  subtitle?: string
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <div className="bg-white border-b border-neutral-200 px-4 md:px-8 py-4 md:py-6">
      <h1 className="text-2xl md:text-3xl font-bold text-neutral-900">{title}</h1>
      {subtitle && <p className="text-sm md:text-base text-neutral-600 mt-1">{subtitle}</p>}
    </div>
  )
}
